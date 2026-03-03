import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

export default function App() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!cameraPermission) {
    return <View style={styles.container} />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to use the camera.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isProcessing) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
      } catch {
        Alert.alert('Capture Error', 'Failed to take the picture. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setPhotoUri(null)}>
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
            {isProcessing ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
              <Text style={styles.buttonText}>Snap Picture</Text>
            )}
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
    paddingVertical: 60,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  promptBox: {
    backgroundColor: 'rgba(255, 209, 220, 0.95)',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  promptText: {
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
  },
  captureButton: {
    backgroundColor: '#98FF98',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 35,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  captureButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  actionRow: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: '#98FF98',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: '#FFD1DC',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 30,
    elevation: 3,
  },
});