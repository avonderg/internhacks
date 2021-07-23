import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, SafeAreaView, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Text } from 'react-native'
import { format } from 'date-fns';
import { db } from '../../firebase/config'
import { AuthContext } from '../auth/AuthContext'

import TimelineCalendar from '../../shared/TimelineCalendar';
import AgendaItem from '../../shared/components/AgendaItem';
import ToDoListItem from '../../shared/components/ToDoItem';
import EmptyDay from '../../shared/components/EmptyDay'
import PlusButton from '../../shared/components/PlusButton'
import QuoteBlock from '../../shared/components/QuoteBlock';

const windowHeight = Dimensions.get('window').height;

export default function HomeWeekly({ navigation }) {
    const { user } = useContext(AuthContext)
    const [events, setEvents] = useState({})
    const [tasks, setTasks] = useState([])
    const [date, setDate] = useState(new Date())
    const [currentEvents, setCurrentEvents] = useState([]); // need initial state to be current date
    const [viewDay, setViewDay] = useState(true);
    const [toDoItem, setToDoItem] = useState(true)

    useEffect(() => {
        const userRef = db.collection("users").doc(user.uid)
        userRef.onSnapshot((doc) => {
            if (doc.exists) {
                const taskList = doc.data()["tasks"]
                if (taskList.length === 0) {
                    setToDoItem(true)
                } else {
                    setTasks(taskList)
                    setToDoItem(false)
                }

                const eventsList = doc.data()["events"]
                setEvents(eventsList)
            } else {
                console.log("No such document!")
            }
        })

    }, [])


    const dateChangeHandler = (newDate) => {
        setDate(newDate)
        const dayString = format(newDate, "yyyy-MM-dd")

        const todayEvents = []
        events.map((event) => {
            if (event.edate === dayString) {
                todayEvents.push(event)
            }
        })
        console.log(currentEvents)
        if (todayEvents.length > 0) {
            setCurrentEvents(todayEvents.sort((x, y) => {
                return x["estime"] - y["estime"]
            }))
            setViewDay(false)
        } else {
            setCurrentEvents("None")
            setViewDay(true)
        }
    }

    const onPressDay = () => {
        if (currentEvents.length == 0) {
            navigation.navigate("DailyView", { todayEvents: "None" })
        } else {
            navigation.navigate("DailyView", { todayEvents: currentEvents })
        }
    }
    return (
        <SafeAreaView>
            <TimelineCalendar date={date} onChange={(newDate) => dateChangeHandler(newDate)} events={events} />
            <View style={style.main}>
                {/* <ScrollView> */}
                <TouchableWithoutFeedback onPress={() => onPressDay()} >
                    <View>
                        <ScrollView style={style.agendalist}>
                            {viewDay ? <EmptyDay nav={navigation} type="weekly" type2="event" /> :
                                <View>
                                    {currentEvents.map((todayEvent) => {
                                        return (
                                            <View key={todayEvent.ename}>
                                                <AgendaItem
                                                    id={todayEvent.ename}
                                                    estime={todayEvent.estime}
                                                    eetime={todayEvent.eetime}
                                                    ename={todayEvent.ename}
                                                    epriority={todayEvent.epriority} />
                                            </View>
                                        )
                                    })}
                                </View>
                            }
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>

                {/* Removed because I didn't sort tasks by date yet */}
                {/* <TouchableWithoutFeedback onPress={() => onPressDay()} >
                    <View> */}
                <ScrollView style={style.agendalist}>
                    {toDoItem ? <EmptyDay nav={navigation} type="weekly" type2="toDoItem" /> :
                        <View>
                            {tasks.map((task) => {
                                return (
                                    <>
                                        <View key={task}>
                                            <ToDoListItem
                                                key={task}
                                                task={task} />
                                        </View>
                                    </>
                                )

                            }
                            )}
                        </View>
                    }
                </ScrollView>
                {/* </View>
                </TouchableWithoutFeedback> */}

                <QuoteBlock />


                {/* </ScrollView> */}
            </View>
            <PlusButton nav={navigation} />
        </SafeAreaView>
    )
}
// TODO: When adding styles to ScrollView using contentContainerStyle, scroll feature doesn't work
const style = StyleSheet.create({
    main: {
        display: "flex",
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: "center",
    },
    agendalist: {
        maxHeight: windowHeight / 4,
        marginTop: 15
    },

})