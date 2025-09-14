# API Testing Commands for Booking Endpoints

## 1. Create a Booking (POST /api/bookings)

Replace `<TOKEN>` with your actual JWT token and update the booking data as needed.

```bash
curl -X POST http://localhost:5000/api/bookings \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
  "equipment": "<EQUIPMENT_ID>",
  "startDate": "2024-07-01",
  "endDate": "2024-07-05",
  "totalPrice": 500,
  "deliveryAddress": "123 Farm Road, City",
  "phone": "123-456-7890",
  "notes": "Please deliver early morning"
}'
```

## 2. Get User Bookings (GET /api/bookings/mybookings)

Replace `<TOKEN>` with your actual JWT token.

```bash
curl -X GET http://localhost:5000/api/bookings/mybookings \
-H "Authorization: Bearer <TOKEN>"
```

## Notes

- Ensure your backend server is running on `localhost:5000`.
- Use these commands to verify if bookings are created and fetched correctly.
- Share any error messages or unexpected responses you get from these commands for further diagnosis.
