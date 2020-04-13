import React from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Search from "./Search"
import EmployeeDetail from "./EmployeeDetail"

const Stack = createStackNavigator()

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="History">
          <Stack.Screen name="search" component={Search} options={{ title: 'Search', headerTintColor: 'purple' }} />
          <Stack.Screen name="Detail" component={EmployeeDetail} options={{ title: 'Employee Details', headerTintColor: 'white', headerStyle: { backgroundColor: 'purple' } }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}