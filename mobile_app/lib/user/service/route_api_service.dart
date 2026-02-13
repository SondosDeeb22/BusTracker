//========================================================
//? importing
//========================================================
import 'dart:convert';
import 'dart:io';

import '../../services/api_config.dart';

//========================================================
//? Data model representing a bus route from the API
//========================================================
class RouteApiRoute {
  final String title;
  final String color;
  final int? colorInt;

  const RouteApiRoute({
    required this.title,
    required this.color,
    required this.colorInt,
  });

  factory RouteApiRoute.fromJson(Map<String, dynamic> json) {
    final rawColorInt = json['colorInt'];
    final parsedColorInt = rawColorInt is int
        ? rawColorInt
        : int.tryParse(rawColorInt?.toString() ?? '');

    return RouteApiRoute(
      title: (json['title'] ?? '').toString(),
      color: (json['color'] ?? '').toString(),
      colorInt: parsedColorInt,
    );
  }
}

//================================================================================
//? Service class for fetching bus route data from the backend API
//================================================================================
class RouteApiService {
  final String baseUrl;

  // Initializes the service with optional custom base URL
  // If no URL provided, uses platform-specific default
  RouteApiService({String? baseUrl}) : baseUrl = baseUrl ?? _defaultBaseUrl();

  // Returns the default base URL based on the current platform:
  static String _defaultBaseUrl() {
    return ApiConfig.baseUrl;
  }

  //----------------------------------------------------------------------------------------
  //? Public API methods for fetching different types of routes
  //----------------------------------------------------------------------------------------

  // return a list of RouteApiRoute objects
  Future<List<RouteApiRoute>> fetchAllRoutes() {
    return _fetchRoutes('$baseUrl/api/user/routes/all');
  }

  // return a filtered list of active routes
  Future<List<RouteApiRoute>> fetchOperatingRoutes() {
    return _fetchRoutes('$baseUrl/api/user/routes/operating');
  }

  //----------------------------------------------------------------------------------------
  //? Private helper method that handles the actual HTTP request and response processing
  //----------------------------------------------------------------------------------------

  // Internal method to fetch routes from a specific API endpoint
  // Handles HTTP request, response parsing, error handling, and data transformation

  // returns a list of RouteApiRoute objects or empty list on failure
  Future<List<RouteApiRoute>> _fetchRoutes(String url) async {
    
    final client = HttpClient();// HTTP client for making the request

    try {
      
      final request = await client.getUrl(Uri.parse(url));// GET request to the specified URL

      request.headers.set(HttpHeaders.acceptHeader, 'application/json');

      
      final response = await request.close(); // send the request and store the response
      
      final body = await response.transform(utf8.decoder).join();

      //check that we have no error( no status code between 200 and 299)
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw Exception('Request failed (${response.statusCode}): $body');
      }

      
      final decoded = jsonDecode(body); // Parse the JSON response body


      // extract the 'data' field from the response (expected to contain the route list)
      final data = (decoded is Map<String, dynamic>) ? decoded['data'] : null;

      // If data is not a list, return empty list (handles malformed responses)
      if (data is! List) {
        return const [];
      }

      // Transform the raw data into RouteApiRoute objects
      return data
          .whereType<Map>()
          .map((raw) => RouteApiRoute.fromJson(raw.cast<String, dynamic>()))
          .where((r) => r.title.isNotEmpty)
          .toList();
    } finally {
      // ensure the HTTP client is always closed, even if an exception occurs
      client.close(force: true);
    }
  }
}
