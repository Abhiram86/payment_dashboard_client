# Payment Dashboard Mobile App

React Native frontend for the Payment Dashboard built with Expo.

## Prerequisites

- Node.js (v16 or newer)
- Expo CLI (`npm install -g expo-cli`)
- npm
- Physical device or emulator for testing

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Abhiram86/payment_dashboard_client.git
   cd payment_dashboard_client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory with the following variables:

   ```env
   BASE_URL=http://<your-local-ip>:8080
   ```

   - Replace `<your-local-ip>` with your computer's local IP address (find with `ipconfig` on Windows or `ifconfig` on Mac/Linux)
   - The port should match your NestJS backend server port (default: 8080)

4. **Start the development server**
   ```bash
   expo start
   ```

## Running the App

### Android

- Scan the QR code with the Expo Go app
- Or run on emulator:
  ```bash
  expo start --android
  ```

### iOS

- Scan the QR code with your camera (iOS only)
- Or run on simulator:
  ```bash
  expo start --ios
  ```

## Development Notes

### Connecting to Backend

1. Ensure your NestJS server is running
2. Verify both devices (server and mobile) are on the same network
3. Update `.env` if your server IP changes

### Troubleshooting

- **Connection issues**: Check firewall settings to allow connections on port 8080
- **Environment variables**: Restart Expo after changing `.env`
- **Clear cache**: Run `expo start -c` if you encounter strange behavior

## Project Structure

```
/src
├── screens/        # App screens
├── components/     # Reusable components
├── services/       # API service layer
├── utils/          # Utilities and helpers
├── App.tsx         # Main app component
└── app.json        # Expo configuration
```

## Dependencies

Main libraries used:

- `expo-secure-store` for JWT storage
- `react-native-chart-kit` for data visualization
- `axios` for API calls
- `react-navigation` for navigation

## Optional Setup

For Web development:

```bash
expo install react-native-web @expo/webpack-config
```

```

Key features of this README:
1. Clear environment setup instructions with `.env` example
2. Specific guidance about local IP configuration
3. Platform-specific running instructions
4. Troubleshooting section for common issues
5. Project structure overview
6. Dependency information

The README assumes:
- Backend is running on port 8080 (adjust if different)
- Standard Expo project structure
- Basic React Native development knowledge

You may want to customize:
- The exact port number if your backend uses something other than 8080
- Additional environment variables if your app needs them
- Any project-specific setup instructions
```
