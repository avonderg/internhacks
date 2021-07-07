import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles/homestyle';
import { db, auth } from '../../firebase/config'

export default function HomeScreen({ navigation }) {

    const pressHandler = (screen) => {
        navigation.navigate(screen)
    }


    return (
        <View>
            <Text>Home Screen</Text>
            <TouchableOpacity onPress={() => pressHandler("ToDoList")}>
                <Text>Go to ToDoList</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pressHandler("MonthlyCalendar")}>
                <Text>Go to MonthlyCalendar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pressHandler("DailyView")}>
                <Text>Go to Daily</Text>
            </TouchableOpacity>

            {/* All these should be in that button at the bottom center */}
            <TouchableOpacity onPress={() => pressHandler("InputToDoList")}>
                <Text>Go to InputToDoList</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pressHandler("Mood")}>
                <Text>Go to Mood</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pressHandler("Schedule")}>
                <Text>Go to Schedule</Text>
            </TouchableOpacity>
        </View>
    )
}