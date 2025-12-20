//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import 'homepageUser.dart';

//========================================================
class CoverPage extends StatelessWidget {
  const CoverPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Upper part (Logo) -------------------------------------
            Container(
              height: 500,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Color(0xFF59011A),
                borderRadius: BorderRadius.only(
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image(
                    image: AssetImage('assets/BusLogoWhite.png'),
                    width: 150,
                    height: 150,
                  ),

                  SizedBox(height: 80),

                  Text(
                    'NEU Bus Tracker',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 30,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            // Lower section with button -------------------------------------
            Expanded(
              child: Container(
                color: Color(0xFFF2F1ED),

                child: Center(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => const HomepageUser(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFF59011A),
                      padding: EdgeInsets.symmetric(horizontal: 50, vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                    // Button content and styling ---------- 
                    child: Text(
                      'Explore Buses',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
