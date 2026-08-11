# Jingle Plan App

## Project Description

The **Jingle Plan App** is designed to help individuals reflect on and finalize the last year in various aspects of their lives, including health, work, pleasure, self-development, education, and more. Starting from December 1st to December 31st, users will receive daily tasks that cover both essential aspects and mood-boosting activities. Additionally, a specially chosen music track for each day aims to enhance the Christmas spirit.

## Technologies Used

- **React Native:** The Jingle Plan App is developed using the React Native framework.

## Features

- **Daily Tasks:** Users will receive one necessary task and one mood-boosting task every day to focus on different aspects of their lives.
- **Music Track:** A unique music track will be provided each day to add a festive touch and improve the Christmas mood.
- **Pick Images:** Users can curate a collection of images that capture the essence of each specific month. At the end of the project, the user receives a personalized photo album, filled with vivid memories from the past year, bringing brightness to their reflections.
- **Multi-Language Support:** Users can choose between English and Ukrainian languages for a personalized experience.

## Getting Started

Follow these steps to set up and run the project:

### Prerequisites

Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (recommended version: 24)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A package manager (e.g., npm or yarn)
- [Android Studio](https://developer.android.com/studio) for Android development (if targeting Android)
- Xcode (on macOS) for iOS development (if targeting iOS)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/murarova/jingle-plan.git
   cd jingle-plan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Apply patches (if any):
   ```bash
   npm run postinstall
   ```

### Available Scripts

The following scripts are available for development and testing:

- **Start the development server**:
  ```bash
  npm start
  ```
  This command will start the Expo development server and provide a QR code for testing on your device.

- **Run on Android**:
  ```bash
  npm run android
  ```
  This will build and run the app on an Android emulator or connected device.

- **Run on iOS**:
  ```bash
  npm run ios
  ```
  This will build and run the app on an iOS simulator (macOS only).

- **Run on Web**:
  ```bash
  npm run web
  ```
  This will start the Expo development server in web mode and open the app in your default browser.

### Additional Notes

- Ensure you have the necessary environment set up for the platform you are targeting (e.g., Android Studio for Android, Xcode for iOS).
- For detailed Expo documentation, refer to the [official Expo Docs](https://docs.expo.dev/).

## Folder ownership

- Every screen is a folder with `index.tsx` (`screens/<name>-screen/`).
- Screen-only UI and hooks live under that screen folder.
- `components/` is shared product UI only; Gluestack primitives live in `ui/`.
- Shared/infra hooks live in `hooks/`; providers live in `providers/`.
- Prefer `@/` imports. Split domain types/constants/utils by file — avoid catch-all magnets.

## License

This project is licensed under the [MIT License](LICENSE.md).

