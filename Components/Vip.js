
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { colors, loadPage } from '../BaseStyle/Style';
import Toast from 'react-native-toast-message';

const Vip = () => {
    const linkFb = 'https://www.facebook.com/minhthuan1682/';
    const openFbWithBrowser = async () => {
        const supported = await Linking.canOpenURL(linkFb);
        if (supported) {
            await Linking.openURL(linkFb);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Không mở được link đó roài',
                text2: 'Mở thủ công giúp mình nhen hihi',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>VIP có lợi ích gì?</Text>
            <View style={styles.contentContainer}>
                <Text style={styles.content}>- Loại bỏ quảng cáo</Text>
                <Text style={styles.content}>- Dùng đăng ký môn học (hên xui nhanh hơn web trường :v)</Text>
                <Text style={styles.content}>- Tích hợp chatGPT (lỏ lắm aaa)</Text>
                <Text style={styles.content}>- Buff tư bản cho nhóm phát triển</Text>
            </View>
            <Text style={styles.h1}>Giá cả phải chăng</Text>
            <View style={styles.contentContainer}>
                <Text style={styles.content}>- Chỉ với 10k/tháng thì bạn đã có thể trải nghiệm dịch vụ củ chuối nhất của chúng toii</Text>
            </View>
            <Text style={styles.h1}>Cách đăng ký Vip</Text>
            <View style={styles.contentContainer}>
                <Text style={styles.content}>Bạn hãy chuyển khoản qua các kênh sau:</Text>
                <Text style={styles.content}>- Momo: 0909090909 (Nguyễn Huỳnh Mai)</Text>
                <Text style={styles.content}>- BIDV: 0987654321 (Minh Thanh Thanh)</Text>
                <Text style={styles.content}>* Nội dung chuyển khoản: Mã số sinh viên</Text>
                <Text style={[styles.content, { marginTop: 10 }]}>Sau khi nhận được tiền thì tùy tâm trạng mà chúng tôi sẽ xem xét có mở Vip cho bạn không. Nếu không được mở Vip, bạn vui lòng liên hệ 113 để bắt giữ chúng tôi. Xin cảm ơn!</Text>
                <Text style={[styles.content, { color: 'red' }]}>Lưu ý: Sau khi mở khóa Vip, bạn cần thoát ra vào lại thì mới sài được, còn lỡ không sài được thì do bạn đen, không phải do chúng tôi :v</Text>
            </View>
            <Text style={[styles.content, { marginTop: 10, fontWeight:'bold' }]}>Liên hệ để được mở Vip nhanh hơn:</Text>
            <TouchableOpacity onPress={openFbWithBrowser}>
                <Text style={[styles.content, { textAlign: 'center', color: 'blue', textDecorationLine: 'underline', fontWeight: 'bold' }]}>https://www.facebook.com/minhthuan1682/</Text>
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    h1: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20
    },
    contentContainer: {
        paddingLeft: 10
    },
    content: {
        fontSize: 16
    }

});

export default Vip;
