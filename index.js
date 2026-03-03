// STARTING CODE
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, View, Text } from 'react-native';
 
export default function App() {
  const [permission, requestPermission] = useCameraPermissions()
  
  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} facing="back">
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Text style={{color: 'white', textAlign: 'center'}}>Find a Red Object!</Text>
        </View>
      </CameraView>
    </View>
  );
}
