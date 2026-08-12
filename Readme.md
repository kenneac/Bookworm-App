/(mobile)
1. > npx create-expo-app@latest .
2. run > npx expo install expo-image    
this uses expo image components with more refined image features
3. > npx expo install expo-image-picker expo-file-system
expo-image-picker lets the user pick/take a photo
expo-file-system is handy if you need to read the picked image as base64 or manage local file URIs before uploading
4. https://storyset.com to get free illustrated images
5. https://www.jetbrains.com/lp/mono/  to download fonts
6. Use KeyboardAvoidingView from react-native to ensure sensitivity to keyboard
7. > npx expo install @expo/vector-icons
8. > npm install zustand
https://zustand.docs.pmnd.rs/learn/getting-started/introduction
 It's a small, lightweight state management.
9. > npx expo install @react-native-async-storage/async-storage
10. Create the authStore.js  --- uses FETCH & AWAIT
11. app/_layout.tsx should use useSegment(), to check auth anytime the tab changes
12. app/_layout.tsx add navigation check
13. (tab)/create... Using base64 to transform an image into text
14. run > npx expo install expo-image-picker expo-file-system
image picker      for grabbing image
expo-file-system     reading/writing/moving files in the app's own sandboxed storage (cache/document directories) 