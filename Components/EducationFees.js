import React, { useState } from 'react';
import { View, Text, Picker, FlatList, StyleSheet } from 'react-native';

const EducationFees = () => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [feesData, setFeesData] = useState([
    // Mảng chứa dữ liệu học phí, ví dụ:
    {
      subjectName: 'Môn 1',
      credit: 3,
      unitPrice: 100000, // Đơn giá một tín chỉ
      discount: 0,
    },
    {
      subjectName: 'Môn 2',
      credit: 4,
      unitPrice: 120000,
      discount: 20000, // Miễn giảm
    },
    // Thêm các môn khác tương tự
  ]);

  const getTotalFees = () => {
    const totalCredit = feesData.reduce((total, item) => total + item.credit, 0);
    const totalAmount = feesData.reduce(
      (total, item) => total + item.credit * (item.unitPrice - item.discount),
      0
    );
    return { totalCredit, totalAmount };
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>{`Môn học: ${item.subjectName}`}</Text>
      <Text>{`Số tín chỉ: ${item.credit}`}</Text>
      <Text>{`Đơn giá/tín chỉ: ${item.unitPrice}`}</Text>
      <Text>{`Thành tiền: ${item.credit * (item.unitPrice - item.discount)}`}</Text>
      <Text>{`Miễn giảm: ${item.discount}`}</Text>
      <Text>{`Phải thu: ${item.credit * (item.unitPrice - item.discount)}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedSemester}
        onValueChange={(itemValue, itemIndex) => setSelectedSemester(itemValue)}
      >
        <Picker.Item label="Học kì 1 năm 2022-2023" value="semester1_2022_2023" />
        {/* Thêm các học kì khác nếu cần */}
      </Picker>

      <FlatList
        data={feesData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.totalContainer}>
        <Text>{`Tổng học phí: ${getTotalFees().totalAmount}`}</Text>
        <Text>{`Tổng tín chỉ: ${getTotalFees().totalCredit}`}</Text>
        <Text>{`Tổng phải thu: ${getTotalFees().totalAmount}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    width: '30%',
    marginBottom: 16,
    borderWidth: 1,
    padding: 8,
  },
  totalContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 8,
  },
});

export default EducationFees;
