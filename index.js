// STARTING CODE
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, use } from 'react';
import { Button, View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
 
export default function App() {
  const [permission, requestPermission] = useCameraPermissions()
  const [photoUri, setPhotoUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View style={styles.container} />;
  }
  if (!permission.granted) {
    return (
      <View styles = {styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to use the camera</Text>
        <Button title ="Grant Permission" onPress={requestPermission} color="#98FF98" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isProcessing) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
        Alert.alert('Photo Taken', 'Photo has been taken successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
        <View style={styles.retakeContainer}>
          <TouchableOpacity style={styles.retakeButton} onPress={() => setPhotoUri(null)}>
            <Text style={styles.buttonText}>Retake Picture</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.promptBox}>
            <Text style={styles.promptText}>Find a Blue Object!</Text>
          </View>
          <TouchableOpacity 
            style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]} 
            onPress={takePicture}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>
              {isProcessing ? 'Capturing...' : 'Snap Picture'}
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD1DC',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
    color: '#333',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  promptBox: {
    backgroundColor: 'rgba(255, 209, 220, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  promptText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
  captureButton: {
    backgroundColor: '#98FF98',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
  },
  captureButtonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  retakeContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  retakeButton: {
    backgroundColor: '#FFD1DC',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
});
