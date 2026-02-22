//===================================================================================================
//? Importing
//===================================================================================================

//import models
import stationModel from "../models/stationModel";
import RouteStationModel from "../models/routeStationModel";

import { Op } from 'sequelize';

//import Enums
import { defaultType, status } from '../enums/stationEnum';

import { ConflictError, NotFoundError, ValidationError, InternalError } from '../errors';

//import interfaces
import { stationAttributes, stationListObjects } from '../interfaces/stationInterface';

// import helpers
import { UserHelper } from "../helpers/userHelper";
const helper = new UserHelper();



//===================================================================================================



export class StationService{  

    private async fetchDefaultStationIdsByType(type: defaultType): Promise<string[]> {
        const rows = await stationModel.findAll({
            attributes: ['id'],
            where: { defaultType: type }
        });

        return Array.from(rows)
            .map((station: stationListObjects) => String(station?.id))
            .filter((id: string) => id.trim().length > 0);
    }

    //===================================================================================================
    //? function to Add Station
    //===================================================================================================

    async addStation(payload: Record<string, any>): Promise<{ messageKey: string }> {
        try{
            await helper.add(stationModel, payload, {

                nonDuplicateFields: ['stationName'],
                //----------------------------------------------------------------
                transform: async(data) => {
                    const out = {...data};

                    if(out.stationName){
                        out.stationName = String(data.stationName).toLowerCase().trim();
                    }

					if (out.defaultType === undefined) {
						out.defaultType = defaultType.notDefault;
					}
					out.isDefault = out.defaultType !== defaultType.notDefault;
					if (out.isDefault === true) {
						out.status = status.covered;
					}

                    return out;
                    
                },    
              }
            );

            return { messageKey: "stations.success.added" };
        
        }catch(error){
            console.error('Error occured while creating station.', error);

            if (
                error instanceof ValidationError ||
                error instanceof ConflictError ||
                error instanceof NotFoundError
            ) {
                throw error;
            }

            throw new InternalError('common.errors.internal');
        }
        
    }

    //===================================================================================================
    //? function to Remove Station
    //===================================================================================================
    async removeStation(stationId: unknown): Promise<{ messageKey: string }> {
        await helper.remove(stationModel, 'id', String(stationId));
        return { messageKey: 'common.crud.removed' };
    }

    //===================================================================================================
    //? function to Update station
    //===================================================================================================
    async updateStation(payload: Record<string, any>): Promise<{ updated: boolean; messageKey: string }> {
		const nextPayload = { ...(payload || {}) };
		if (nextPayload.defaultType === undefined) {
			nextPayload.defaultType = defaultType.notDefault;
		}
		nextPayload.isDefault = nextPayload.defaultType !== defaultType.notDefault;
		if (nextPayload.isDefault === true) {
			nextPayload.status = status.covered;
		}

        const result = await helper.update(stationModel, nextPayload, {
            enumFields: [{ field: "status", enumObj: status }]
        });

		// ensure default stations are always covered
		await stationModel.update(
			{ status: status.covered },
			{ where: { defaultType: { [Op.not]: defaultType.notDefault } } }
		);

        return {
            updated: result.updated,
            messageKey: result.updated ? 'common.crud.updated' : 'common.crud.noChanges'
        };
    }

    //===================================================================================================
    //? function to Fetch All Stations
    //===================================================================================================

    async fetchAllStations(): Promise<{ messageKey: string; data: unknown }> {
        try {
            // get all covered stations
            const coveredStationRows = await RouteStationModel.findAll({
                attributes: ['stationId'],
                group: ['stationId']
            });

            const coveredStationIds = coveredStationRows
                .map((row: any) => String(row.stationId))
                .filter((id) => id.trim().length > 0);

            if (coveredStationIds.length > 0) {
            
                // update covered stations' status to "covered"
                await stationModel.update(
                    { status: status.covered },
                    { where: { id: { [Op.in]: coveredStationIds } } }
                );

                // update stations' status to "notCovered"
                await stationModel.update(
                    { status: status.notCovered },
                    { where: { id: { [Op.notIn]: coveredStationIds } } }
                );
            } else {
                await stationModel.update(
                    { status: status.notCovered },
                    { where: {} }
                );
            }

			// default stations are always covered
			await stationModel.update(
				{ status: status.covered },
				{ where: { defaultType: { [Op.not]: defaultType.notDefault } } }
			);

            const stations = await stationModel.findAll({
                attributes: ['id', 'stationName', 'status', 'latitude', 'longitude', 'isDefault', 'defaultType']
            });

            return { messageKey: 'stations.success.fetched', data: stations };
        // -----------------------------------------------------------------------------------
        } catch (error) {
            console.error('Error occured while fetching stations.', error);
            throw new InternalError('common.errors.internal');
        }
    }

    // =====================================================================================================
    //? Function to fetch default stations (fixed stations - stations that must exists in all routes)
    // ===================================================================================================== 
    async fetchDefaultStations(): Promise<{messageKey: string; data: unknown}> {
        try {
            const stations = await stationModel.findAll({
                attributes: ['id'],
				where: { defaultType: { [Op.not]: defaultType.notDefault } }
            });
            
            const defaultStations = Array.from(stations);

            // return string array of default stations' ids
            const fixedStationIds = defaultStations
				.map((station: stationListObjects) => String(station?.id))
				.filter((id: string) => id.trim().length > 0);


            return { messageKey: 'stations.success.fetched', data: fixedStationIds };
        // -----------------------------------------------------------------------------------
        } catch (error) {
            console.error('Error occured while fetching Default Stations', error);
            throw new InternalError('common.errors.internal');
        }
    }



    //===================================================================================================
    //? function to Fetch Stations for Route Picker (exclude fixed/default stations)
    //===================================================================================================
    async fetchStationsForPicker(): Promise<{ messageKey: string; data: unknown }> {
        try {

			const defaultStationsResult = await this.fetchDefaultStations();
            const defaultStations: string[]= defaultStationsResult.data as string[];


            // -----------------------------------------------------------------
            const stations = await stationModel.findAll({
				attributes: ['id', 'stationName', 'status', 'latitude', 'longitude', 'isDefault', 'defaultType']
            });

            const filteredStations = (stations as stationAttributes[]).filter(
				(station) => {
					const id:string = String((station as stationAttributes)?.id);
					const isDefaultByType:boolean = String((station as stationAttributes)?.defaultType) !== String(defaultType.notDefault);
					
					return !isDefaultByType && !defaultStations.includes(id);
				}
            );

            return { messageKey: 'stations.success.fetched', data: filteredStations };
        // -----------------------------------------------------------------------------------
        } catch (error) {
            console.error('Error occured while fetching stations for picker.', error);
            throw new InternalError('common.errors.internal');
        }
    }

	// ==================================================================================
    //? function to Fetch Default START Stations
    // ==================================================================================
    async fetchDefaultStartStations(): Promise<{ messageKey: string; data: unknown }> {
		try {
			const ids = await this.fetchDefaultStationIdsByType(defaultType.start);
			return { messageKey: 'stations.success.fetched', data: ids };

		// -----------------------------------------------------------------------------------
        } catch (error) {
			console.error('Error occured while fetching Default Start Stations', error);
			throw new InternalError('common.errors.internal');
		}
	}

	// ==================================================================================
    //? function to Fetch Default END Stations
    // ==================================================================================
	async fetchDefaultEndStations(): Promise<{ messageKey: string; data: unknown }> {
		try {
			const ids = await this.fetchDefaultStationIdsByType(defaultType.end);
			return { messageKey: 'stations.success.fetched', data: ids };

		// -----------------------------------------------------------------------------------
        } catch (error) {
			console.error('Error occured while fetching Default End Stations', error);
			throw new InternalError('common.errors.internal');
		}
	}

}
