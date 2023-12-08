import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../BaseStyle/Style';
import { getScoreBoard } from '../service/NLUApiCaller';



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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchScoreData = async () => {

      setIsLoading(true)
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
      setIsLoading(false)

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
                      <Text style={styles.scoreContainer}>{`Số tín chỉ: ${subject.numCredit}`}</Text>
                      <Text style={[styles.scoreStyle, styles.scoreContainer]}>{`Điểm TK hệ 10: ${subject.grade}`}</Text>
                      <Text style={[styles.scoreStyle, styles.scoreContainer]}>{`Điểm TK hệ 4: ${subject.grade4}`}</Text>
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2bc250" />
        </View>) : (<></>)
      }
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
  subjectName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scoresContainer: {
    display: 'flex',
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  loadingContainer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#bec4c2',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -75 }],
    width: 150,
    height: 150,
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 0.8,
  },
});

export default Score;