import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions,Platform, ScrollView } from 'react-native';
import { AppLoading } from "expo";
import ToDo from "./ToDo";

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos : {}
  }
  componentDidMount = () => {
    this._loadToDos();
  }
  render(){
    const {newToDo,loadedToDos, toDos} = this.state;
    if(!loadedToDos){
      console.log(toDos)
      return <AppLoading />
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"New To Do"} 
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).map(toDo => <ToDo key={toDo.id}{...toDo} deleteToDo={this._deleteToDo}/>)}
          </ScrollView>
        </View>
      </View>
    )
  }
  _controlNewToDo = text =>{
    this.setState({
      newToDo : text
    })
  };
  _loadToDos = () => {
    this.setState({
      loadedToDos : true
    })
  };
  _addToDo = () => {
    const { newToDo } = this.state;
    console.log(newToDo);
    if(newToDo !== ""){
      this.setState(prevState => {
        const Id = +Date.now()
        const newToDoObject = {
          [Id]:{
            id : Id,
            isCompleted : false,
            text : newToDo,
            createdAt : Date.now()
          }
        }
        const newState = {
          ...prevState,
          newToDo : "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        console.log(newState)
        return {...newState}
      })
    }
  };
  _deleteToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      }
      return { ...newState };
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center'
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    //안드로이드와 ios 세팅이 다름.
    ...Platform.select({
      ios:{
        shadowColor:"rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset:{
          height:-1,
          width:0
        }
      },android: {
        elevation : 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor:"#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    paddingLeft: 10
  }
});
