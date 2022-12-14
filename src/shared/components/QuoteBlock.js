import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import 'firebase/firestore';
import { db } from '../../firebase/config';
import { AuthContext } from '../../screens/auth/AuthContext';

const windowWidth = Dimensions.get('window').width;

export default function QuoteBlock(props) {
    const { user } = useContext(AuthContext)
    const [quotes, setQuotes] = useState([])
    const [randomQuote, setRandomQuote] = useState("")

    const userRef = db.collection("mentalWellness").doc("quotes")
    userRef.onSnapshot((doc) => {
        if (doc.exists) {
            const allQuotes = doc.data()
            setQuotes(allQuotes)
        } else {
            console.log("No such document!")
        }
    })

    useEffect(() => {
        const randomNum = Math.floor(Math.random() * 20)
        setRandomQuote("quote" + randomNum)
    }, [])

    return (
        <View style={style.card}>
            <View style={style.container}>
                <Text style={style.quote}>{quotes[randomQuote]}</Text>
            </View>
        </View>
    )
}

// TODO: Fix text so that it wraps and doesnt go past the screen width

const style = StyleSheet.create({
    card: {
        backgroundColor: "#fffbee",
        padding: 25,
        marginTop: 15,
        borderRadius: 10,
        width: windowWidth - 30,
    },
    container: {
        flexDirection: "column",
        alignItems: "center",
    },
    quote: {
        color: "#9A76A5",
        fontSize: 15,
        textAlign: "center"
    }
})
