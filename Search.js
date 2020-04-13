import React from "react"
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity
} from "react-native"
import Constants from "expo-constants"
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase("database")

export default class Search extends React.Component {
    state = {
        text: null,
        employees: null
    }

    componentDidMount() {
        console.log("DidMount")
        db.transaction(tx => {
            tx.executeSql(
                "create table if not exists employee (EmpID integer primary key not null, name text not null, title text not null, phone text not null, email text not null, Dept_id integer, FOREIGN KEY(Dept_id) REFERENCES Department(DeptID));"
            )
        })

        db.transaction(tx => {
            tx.executeSql(
                "create table if not exists department (DepID integer primary key not null, name text);"
            )
        })

        this.onCreate()
    }

    onCreate = () => {
        db.transaction(
            tx => {
                tx.executeSql("insert into department (name) values (?)", ["Sales"]);
                tx.executeSql("insert into department (name) values (?)", ["Management"]);

                // tx.executeSql("select * from department", [], (_, { rows }) =>
                //     console.log(JSON.stringify(rows._array))
                // );
            }
        );

        db.transaction(
            tx => {
                tx.executeSql("insert into employee (name, title, phone, email, Dept_id) values (?,?,?,?,?)", ["Ahmad", "sales", "011", "a@a.com", 1]);
                tx.executeSql("insert into employee (name, title, phone, email, Dept_id) values (?,?,?,?,?)", ["Mohamed", "sales", "012", "m@a.com", 1]);
                tx.executeSql("insert into employee (name, title, phone, email, Dept_id) values (?,?,?,?,?)", ["Sabry", "sales", "010", "s@a.com", 1]);
                tx.executeSql("insert into employee (name, title, phone, email, Dept_id) values (?,?,?,?,?)", ["Ayman", "sales", "010", "s@a.com", 1]);
                tx.executeSql("insert into employee (name, title, phone, email, Dept_id) values (?,?,?,?,?)", ["Samy", "sales", "010", "sa@a.com", 1]);
                tx.executeSql("insert into employee (name, title, phone, email, Dept_id) values (?,?,?,?,?)", ["Mohsen", "manager", "011", "mo@a.com", 2]);
                tx.executeSql("insert into employee (name, title, phone, email, Dept_id) values (?,?,?,?,?)", ["Karim", "manager", "012", "k@a.com", 2]);
                tx.executeSql("insert into employee (name, title, phone, email, Dept_id) values (?,?,?,?,?)", ["Karin", "manager", "012", "ka@a.com", 2]);
                tx.executeSql("insert into employee (name, title, phone, email, Dept_id) values (?,?,?,?,?)", ["Ali", "manager", "010", "Al@a.com", 2]);
                tx.executeSql("insert into employee (name, title, phone, email, Dept_id) values (?,?,?,?,?)", ["Mariam", "manager", "012", "Ma@a.com", 2]);

                // tx.executeSql("select * from employee", [], (_, { rows }) =>
                //     console.log(JSON.stringify(rows))
                // );
            },
        );
    }

    componentWillUnmount() {
        this.onUpgrade()
    }

    onUpgrade = () => {
        console.log("DidMount")

        db.transaction(tx => {
            tx.executeSql("drop table department", [])
            tx.executeSql("drop table employee", [])
        })
    }

    getEmployees = (query) => {

        db.transaction(tx => {
            tx.executeSql(
                "select EmpID,name from employee where name = ?", [query],
                (_, { rows }) => {
                    if (rows.length > 0)
                        this.setState({ employees: rows._array })
                    else
                        this.setState({ employees: null })
                }
            )
        })

    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Enter Employee Name</Text>
                <View style={styles.flexRow}>
                    <TextInput
                        onChangeText={text => this.setState({ text })}
                        onSubmitEditing={() => {
                            this.getEmployees(this.state.text);
                            this.setState({ text: null });
                        }}
                        placeholder="Search Query"
                        style={styles.input}
                        value={this.state.text}
                    />
                </View>
                <ScrollView style={styles.listArea}>
                    {
                        this.state.employees !== null
                            ? this.state.employees.map((employee, key) => (
                                <View key={key} style={styles.sectionContainer}>
                                    <TouchableOpacity style={styles.employee} onPress={() => { this.props.navigation.navigate('Detail', { employeeID: employee.EmpID }) }}>
                                        <Text style={styles.text}>{employee.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                            : <View style={styles.sectionContainer}>
                                <Text style={{ textAlign: "center" }}>Nothing To Show</Text>
                            </View>
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        paddingTop: Constants.statusBarHeight
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    flexRow: {
        flexDirection: "row"
    },
    input: {
        borderColor: "#4630eb",
        borderRadius: 4,
        borderWidth: 1,
        flex: 1,
        height: 48,
        margin: 16,
        padding: 8
    },
    listArea: {
        backgroundColor: "#f0f0f0",
        flex: 1,
        paddingTop: 16
    },
    sectionContainer: {
        marginBottom: 16,
        marginHorizontal: 16
    },
    sectionHeading: {
        fontSize: 18,
        marginBottom: 8
    },
    text: {
        textAlign: "center",
        fontSize: 22,
        color: 'white'
    },
    employee: {
        backgroundColor: 'purple',
        paddingTop: 15,
        paddingBottom: 15,
    }
});
