import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import MyAlert from './MyAlert'
// import {connect} from 'react-redux';
// import {deleteBook} from '../../services/index';

import './../../assets/css/Style.css';
import {Card,  Image, ButtonGroup,  InputGroup, FormControl} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faEdit, faTrash, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';
// import {Link} from 'react-router-dom';
// import MyToast from '../MyToast';
import axios from 'axios';


const style ={
    display: 'flex',
    justifyContent: 'center'
}

class ListUserComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            users: [],
            show: false,
            message: '', 
            search : '',
            currentPage : 1,
            booksPerPage : 4,
            sortDir: 'asc'
        }
    }
    sortData = () => {
        setTimeout(() => {
          this.state.sortDir === "asc" ? this.setState({sortDir: "desc"}) : this.setState({sortDir: "asc"});
          this.findAllDevices(this.state.currentPage);
        }, 500);
        }
    // componentDidMount() {
    //     ApiService.fetchUsers()
    //         .then((res) => {
    //             this.setState({users: res.data})
    //         });
    // }
    componentDidMount() {
        ApiService.fetchUsers()
            .then((res) => {
                this.setState({users: res.data})
            });
      }

    // componentDidMount() {
    //     this.findAllDevices(this.state.currentPage);
    // }
      findAllDevices(currentPage) {
        currentPage -= 1;
        // ApiService.fetchUsers(currentPage)
        console.log("hiiiiiiiiii")
        axios.get("http://localhost:8080/api/device?pageNo="+currentPage+"&pageSize="+this.state.booksPerPage+"&sortBy=id="+this.state.sortDir)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    users: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
      };
      changePage = event => {
        let targetPage = parseInt(event.target.value);
        if(this.state.search) {
            this.searchData(targetPage);
        } else {
            this.findAllDevices(targetPage);
        }
        this.setState({
            [event.target.name]: targetPage
        });
      };
      firstPage = () => {
        let firstPage = 1;
        if(this.state.currentPage > firstPage) {
            if(this.state.search) {
                this.searchData(firstPage);
            } else {
                this.findAllDevices(firstPage);
            }
        }
      };
      prevPage = () => {
        let prevPage = 1;
        if(this.state.currentPage > prevPage) {
            if(this.state.search) {
                this.searchData(this.state.currentPage - prevPage);
            } else {
                this.findAllDevices(this.state.currentPage - prevPage);
            }
        }
      };
      lastPage = () => {
        let condition = Math.ceil(this.state.totalElements / this.state.booksPerPage);
        if(this.state.currentPage < condition) {
            if(this.state.search) {
                this.searchData(condition);
            } else {
                this.findAllDevices(condition);
            }
        }
      };
      nextPage = () => {
        if(this.state.currentPage < Math.ceil(this.state.totalElements / this.state.booksPerPage)) {
            if(this.state.search) {
                this.searchData(this.state.currentPage + 1);
            } else {
                this.findAllDevices(this.state.currentPage + 1);
            }
        }
      };

    deleteUser = (userId) => {
        ApiService.deleteUser(userId)
           .then(res => {
               if(res.data != null) {
                this.setState({"show":true, message : 'Admin deleted successfully.'});
                setTimeout(() => this.setState({"show":false}), 3000);
                this.setState({
                    users: this.state.users.filter(user => user.id !== userId)
                });
            } else {
                this.setState({"show":false});
            }
           })
    }
    searchChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };

    searchData = (currentPage) => {
        currentPage -= 1;
        axios.get("http://localhost:8080/api/device/search/"+this.state.search+"?page="+currentPage+"&size="+this.state.booksPerPage)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    books: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    };
    editUser = (id) => {
        this.props.history.push('/edit-user/'+ id);
    }

    addUser = () => {
        this.props.history.push('/add-user');
    }

    render() {
        const {users, currentPage, totalPages,search} = this.state;

        return (
            <div>
                <div style={{"display":this.state.show ? "block" : "none"}}>
                    <MyAlert show = {this.state.show} message = {this.state.message} type = {"error"}/>
                </div>
                <Typography variant="h4" style={style}>Devices Details</Typography>
                <Button variant="contained" color="primary" onClick={() => this.addUser()}>
                    Add User
                </Button>
                <div style={{"float":"left"}}>
                             <InputGroup size="sm">
                                <FormControl placeholder="Search" name="search" value={search}
                                    className={"info-border bg-dark text-white"}
                                    onChange={this.searchChange}/>
                                <InputGroup.Append>
                                    <Button size="sm" variant="outline-info" type="button" onClick={this.searchData}>
                                        <FontAwesomeIcon icon={faSearch}/>
                                    </Button>
                                    <Button size="sm" variant="outline-danger" type="button" onClick={this.cancelSearch}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                </InputGroup.Append>
                             </InputGroup>
                        </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell align="right">Id</TableCell>
                            <TableCell align="right">FirstName</TableCell>
                            <TableCell align="right">LastName</TableCell>
                            <TableCell align="right">UserName</TableCell>
                            <TableCell align="right">Age</TableCell>
                            <TableCell align="right">Salary</TableCell> */}


                             <TableCell align="right">Id</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">AvatarUrl</TableCell>
                            <TableCell align="right">ImageUrl</TableCell> 

                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        users.length === 0 ?
                        <TableRow>
                            <TableCell colSpan="6" align="center">No Devices Available.</TableCell>
                        </TableRow> 
                        :
                        users.map(row => (
                            <TableRow key={row.id}>
                                {/* <TableCell align="right">
                                    {row.id}
                                </TableCell>
                                <TableCell align="right">{row.firstName}</TableCell>
                                <TableCell align="right">{row.lastName}</TableCell>
                                <TableCell align="right">{row.username}</TableCell>
                                <TableCell align="right">{row.age}</TableCell>
                                <TableCell align="right">{row.salary}</TableCell>
                                <TableCell align="right" onClick={() => this.editUser(row.id)}><CreateIcon /></TableCell>
                                <TableCell align="right" onClick={() => this.deleteUser(row.id)}><DeleteIcon /></TableCell> */}
                           
                           <TableCell align="right">{row.id}</TableCell>
                                <TableCell align="left">{row.title}</TableCell>
                                <TableCell align="left">{row.price}</TableCell>
                                <TableCell align="left">{row.description}</TableCell>
                                <TableCell align="left">{row.avatarUrl}</TableCell>
                                <TableCell align="left">{row.imageUrl}</TableCell>
                                <TableCell align="left" onClick={() => this.editUser(row.id)}><CreateIcon /></TableCell>
                                <TableCell align="left" onClick={() => this.deleteUser(row.id)}><DeleteIcon /></TableCell>

                           
                           
                            </TableRow>
                        ))
                    }
                     {users.length > 0 ?
                     <Card.Footer>
                            <div style={{"float":"right"}}>
                                Showing Page {currentPage} of {totalPages}
                            </div>
                            <div style={{"float":"right"}}>
                                <InputGroup size="sm">
                                    <InputGroup.Prepend>
                                        <Button type="button" variant="outline-info" disabled={currentPage === 1 ? true : false}
                                            onClick={this.firstPage}>
                                            <FontAwesomeIcon icon={faFastBackward} /> First
                                        </Button>
                                        <Button type="button" variant="outline-info" disabled={currentPage === 1 ? true : false}
                                            onClick={this.prevPage}>
                                            <FontAwesomeIcon icon={faStepBackward} /> Prev
                                        </Button>
                                    </InputGroup.Prepend>
                                    <FormControl className={"page-num bg-dark"} name="currentPage" value={currentPage}
                                        onChange={this.changePage}/>
                                    <InputGroup.Append>
                                    <Button type="button" variant="outline-info" disabled={currentPage === totalPages ? true : false}
                                            onClick={this.nextPage}>
                                            <FontAwesomeIcon icon={faStepForward} /> Next
                                        </Button>
                                        <Button type="button" variant="outline-info" disabled={currentPage === totalPages ? true : false}
                                            onClick={this.lastPage}>
                                            <FontAwesomeIcon icon={faFastForward} /> Last
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </div>
                        </Card.Footer> : null
                    } 
             
                    </TableBody>
                </Table>
                </div> 
           
        );
    }

}

export default ListUserComponent;