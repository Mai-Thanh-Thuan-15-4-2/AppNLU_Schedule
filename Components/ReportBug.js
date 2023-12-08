import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { colors } from '../BaseStyle/Style';

const ReportBug = ({ navigation }) => {
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');

  const handleSubmitBug = () => {
    // Thực hiện xử lý báo cáo lỗi ở đây
    // Gửi thông tin báo cáo lỗi đến server hoặc thực hiện các bước cần thiết
    // Sau khi xử lý xong, bạn có thể chuyển về màn hình trước đó hoặc màn hình khác
    navigation.goBack(); // Chuyển về màn hình trước đó
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Report Bug</Text> */}
      {/* <TextInput
        style={styles.input}
        placeholder="Bug Title"
        value={bugTitle}
        onChangeText={(text) => setBugTitle(text)}
      /> */}
      <TextInput
        style={[styles.input]}
        placeholder="Lỗi gì nè??"
        multiline
        numberOfLines={10}
        value={bugDescription}
        onChangeText={(text) => setBugDescription(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmitBug}>
        <Text style={{color: colors.white}}>Gửi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 200,
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
