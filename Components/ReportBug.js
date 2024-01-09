import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, loadPage } from '../BaseStyle/Style';
import { sendReport } from '../service/NLUAppApiCaller';
import Toast from 'react-native-toast-message';

const ReportBug = ({ navigation }) => {
  const [bugDescription, setBugDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitBug = async () => {
    if (bugDescription.trim() === '') {
      Toast.show({
        type: 'info',
        text1: 'Vui lòng nhập điều bạn muốn nói!!!',
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    setIsLoading(true);
    const message = await sendReport(bugDescription);
    if (message) {
      Toast.show({
        type: 'success',
        text1: 'Cảm ơn bạn đã phản hồi!!',
        visibilityTime: 2000,
        autoHide: true,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Ôi lỗi gì nè, bạn kiểm tra lại nhé!!',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
    setBugDescription('');


    setIsLoading(false);

  };

  return (
    <View style={styles.container}>

      <TextInput
        style={[styles.input]}
        placeholder="Nhập điều bạn muốn nói :3"
        multiline
        numberOfLines={10}
        value={bugDescription}
        onChangeText={(text) => setBugDescription(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmitBug}>
        <Text style={{ color: colors.white }}>Gửi</Text>
      </TouchableOpacity>
      {isLoading ? (
        <View style={loadPage.loadingContainer}>
          <ActivityIndicator size="large" color="#2bc250" />
        </View>) : (<></>)
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 350,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 8,
    textAlign: 'justify',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    color: colors.white,
  },
});

export default ReportBug;
