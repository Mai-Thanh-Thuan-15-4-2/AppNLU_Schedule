import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors } from '../BaseStyle/Style';
import { getScoreBoard } from '../service/NLUApiCaller';

// const scoresData = [
//   {
//     semester: 'Học kỳ 1 năm 2022-2023',
//     subjects: [
//       { code: 'M001', name: 'Toán cao cấp', credits: 4, finalExam: 8, averageGrade4: 3.2, averageGrade10: 7.5 },
//       { code: 'P002', name: 'Lập trình di động', credits: 3, finalExam: 9, averageGrade4: 3.7, averageGrade10: 8.5 },
//       { code: 'P003', name: 'Lập trình di động nâng cao', credits: 3, finalExam: 9, averageGrade4: 3.7, averageGrade10: 8.5 },
//       // Thêm các môn học khác tương tự
//     ],
//   },
//   {
//     semester: 'Học kỳ 2 năm 2022-2023',
//     subjects: [
//       { code: 'M001', name: 'Toán cao cấp', credits: 4, finalExam: 8, averageGrade4: 3.2, averageGrade10: 7.5 },
//       { code: 'P002', name: 'Lập trình di động', credits: 3, finalExam: 9, averageGrade4: 3.7, averageGrade10: 8.5 },
//       { code: 'P003', name: 'Lập trình di động nâng cao', credits: 3, finalExam: 9, averageGrade4: 3.7, averageGrade10: 8.5 },
//       // Thêm các môn học khác tương tự
//     ],
//   },
//   // Thêm thông tin cho các học kỳ khác
// ];

const calculateTotalCredits = (subjects) => {
  return subjects.reduce((total, subject) => total + subject.credits, 0);
};

const calculateWeightedAverage = (subjects, gradeType) => {
  const totalCredits = calculateTotalCredits(subjects);
  const weightedSum = subjects.reduce((sum, subject) => sum + subject[gradeType] * subject.credits, 0);
  return totalCredits > 0 ? weightedSum / totalCredits : 0;
};

const Score = () => {
  const [scoreData, setScoreData] = useState([]);

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        const data = await getScoreBoard();
        if (data.length > 0) {
          setScoreData(data);

        } else {
          Toast.show({
            type: 'error',
            text1: 'Có lỗi xảy ra!',
            text2: 'Không thể lấy dữ liệu từ trang ĐKMH',
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra!',
          text2: 'Không thể lấy dữ liệu từ trang ĐKMH',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    };

    fetchScoreData();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={scoreData}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.semesterContainer}>
            <Text style={styles.semesterText}>{item.name}</Text>
            {item.scores && item.scores.length > 0 ? (
              <View style={styles.subjectsContainer}>
                {item.scores.map((subject) => (
                  <View style={styles.subjectContainer} key={subject.idSubject}>
                    <Text style={styles.subjectName}>{`${subject.idSubject} - ${subject.subjectName}`}</Text>
                    <View style={styles.scoresContainer} key={subject.idSubject}>
                      <Text style={styles.scoreContainer}>{`Số tín chỉ: ${subject.grade}`}</Text>
                      <Text style={[styles.scoreStyle, styles.scoreContainer]}>{`Điểm TK hệ 10: ${subject.grade}`}</Text>
                      <Text style={[styles.scoreStyle, styles.scoreContainer]}>{`Điểm TK hệ 4: ${subject.g}`}</Text>
                      <Text style={[styles.scoreStyle, styles.scoreContainer]}>{`Điểm TK (C): ${subject.charGrade}`}</Text>
                    </View>
                  </View>

                ))}
              </View>
            ) : (
              <Text>No subjects available</Text>
            )}

            <View style={styles.subjectsContainer}>
              <View>
                <Text style={styles.scoreStyle}>{`Điểm TB cả kì hệ 4: ${(item.scoreSemester4 !== undefined ? item.scoreSemester4 : '')}`}</Text>
                <Text style={styles.scoreStyle}>{`Điểm TB cả kì hệ 10: ${(item.scoreSemester10 !== undefined ? item.scoreSemester10 : '')}`}</Text>
                <Text style={styles.scoreStyle}>{`Tổng số tín chỉ đạt: ${(item.numSemesterCredit !== 0 ? item.numSemesterCredit : '')}`}</Text>

              </View>

              <View>
                <Text style={styles.scoreStyleCK}>{`Điểm TB cả kì hệ 4: ${(item.score4 !== undefined ? item.score4 : '')}`}</Text>
                <Text style={styles.scoreStyleCK}>{`Điểm TB cả kì hệ 10: ${(item.score10 !== undefined ? item.score10 : '')}`}</Text>
                <Text style={styles.scoreStyleCK}>{`Tổng số tín chỉ đạt: ${(item.numCredit)}`}</Text>

              </View>
            </View>

          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  semesterContainer: {
    marginBottom: 32,
  },
  semesterText: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
  },
  subjectContainer: {
    width: '100%',
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    backgroundColor: colors.backgroundColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  subjectName:{
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scoresContainer: {
    display: 'flex',
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent:'space-between',
    marginBottom: 3,
    padding: 6,
  },
  scoreContainer: {
    width: '48%',
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    backgroundColor: colors.backgroundColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  scoreStyle: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  scoreStyleCK: {
    fontWeight: 'bold',
    color: colors.success,
  },
});

export default Score;