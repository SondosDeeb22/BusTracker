//========================================================
//? importing
//========================================================

//========================================================
//? models
//========================================================

class DriverProfileModel {
  final String id;
  final String name;
  final String phone;
  final String language;
  final String appearance;

  const DriverProfileModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.language,
    required this.appearance,
  });

  factory DriverProfileModel.fromJson(Map<String, dynamic> json) {
    return DriverProfileModel(
      id: (json['id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      phone: (json['phone'] ?? '').toString(),
      language: (json['language'] ?? '').toString(),
      appearance: (json['appearance'] ?? '').toString(),
    );
  }
}
