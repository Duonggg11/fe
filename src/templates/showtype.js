import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Card, Spinner,Button, FormControl, Dropdown, Form,Alert,Row,Col } from 'react-bootstrap';
import {getAPI} from '../service/api.js';
import { useHistory,useParams } from 'react-router';
import {useSnackbar} from 'notistack';
import { FaCommentAlt,FaElementor,FaWaze,FaHouseDamage,FaUserSlash } from "react-icons/fa";

const getPostAPI = (id) => {
  return getAPI("/showbytype/"+id);
};
const deletePostAPI = (id) => {
    return getAPI('/deletepost/'+id);
}
function ShowType(){
    let {id} = useParams();
    let name = "";
    const [searchValue,setSearchValue] = useState({value:''});
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const token = localStorage.getItem("token");
    console.log("token fist:"+token);
    const [postt, setPostt] = useState([]);
    let islogin = false;
    if(token != null){
        islogin = true;
        console.log("token: "+token);
        name = token.split('=')[1];
    }
    useEffect(() => {
        document.title = "Abc Forum"
    }, []);
    const _onDiscusion = (id) => {
        history.push('/');
        history.push('discusion/'+id);
    }
    const onValueChange = (event) =>{
        setSearchValue(prev =>({...prev, value:event.target.value}));
        console.log("your comment "+searchValue.value)
    }
    const _onSearch =(value) => {
        console.log(value);
        history.push('/search/'+value)
    }
    const _onDelete = async (id) => {
        try{
            const rs = await deletePostAPI(id);
            if(rs.status === 200){
                enqueueSnackbar("Xoa Thanh Cong" ,{variant:'success'});
                history.push('/');
                window.location.reload(false);
                
            }
        }catch(e){
            console.log("error: ",e);
        }

    }
    const _onEdit = (id) => {
        history.push('/');
        history.push('edit/'+id);
    }

    useEffect(() => {
        console.log("id truoc:"+id)
        const requestData = async (props) => {
            console.log('id sau:'+id);
        try {
            const result = await getPostAPI(id);
            console.log('id sau 2:'+id);
            if (result.status === 200) {
                setPostt(result.data);
            }
        } catch (e) {
            console.log("error: ",e);
        }
    };
    requestData();
    }, []);
    return (
        <div className="container" style={{'margin-top':'20px'}} >
            <div className="header" >
                <nav class="navbar navbar-default navbar-static-top" role="navigation" style={{'background-color':'greenyellow'}}>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic"> <FaElementor />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item href="showbyid/1">Cho Thuê</Dropdown.Item>
                    <Dropdown.Item href="showbyid/2">Tìm Phòng</Dropdown.Item>
                    <Dropdown.Item href="showbyid/3">Ở Ghép</Dropdown.Item>
                    <Dropdown.Item href="showbyid/4">Căn Hộ</Dropdown.Item>
                    <Dropdown.Item href="showbyid/5">Other</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                    <Link class="navbar-brand" to={{pathname: "/"}} style={{width:'10px'}}>
                        <FaHouseDamage />
                    </Link>
                <Form inline>
                    <FormControl type="text" placeholder="enter your key..." className="mr-sm-2" name='searchValue'onChange = {onValueChange}/>
                    <Button variant="outline-success" id='search' onClick={() => _onSearch(searchValue.value)}>Search</Button>
                </Form>
                {name 
                ?<Alert class="" style={{color:'chocolate'}}><FaWaze/> {name}</Alert>  
                :console.log("name: "+name) }
                <ul class="nav navbar-nav" style={{float:'right','flex-direction':'unset'}}>
                    <li style={{width:'80px','margin-right':'10px'}}>
                        {islogin
                        ?<Link to={{pathname: "/addpost"}}>Add Post</Link>
                        :<Link to={{pathname: "/login"}}>Sign in</Link>}
                    </li>
                    <li className="active">
                        {islogin 
                        ?<Link to={{pathname: "/sigout"}}><FaUserSlash /></Link>   
                        :<Link to={{pathname: "/resigter"}}>Sign Up</Link>}
                    </li>
                </ul>
            </nav>
            </div>
            <div className="content" style={{'padding':'10px 0px'}}>
                {postt.map((row) =>(
                    <Card>
                    <Card.Header>{row.type}</Card.Header>
                    <Card.Body>
                        <Card.Title>{row.title}</Card.Title>
                        <Card.Text>
                            {row.detail}
                            </Card.Text>
                            <Button variant="link" id='cmt' onClick={() => _onDiscusion(row.post_ID)}>Discusion</Button>
                            {name === row.username
                            ?<div className="onCRUD" style={{float:'right','margin-right':'100px'}}>
                                <Button variant="warning" onClick={() => _onEdit(row.post_ID)} style={{'margin-right':'30px'}}>Edit</Button>
                                <Button variant="danger" onClick={() => _onDelete(row.post_ID)}>Delete</Button>
                            </div>
                            : "Posted by: "+row.username
                            }
                    </Card.Body>
                </Card>
                ))}
            </div>
            <div className="footer" style={{'background-color':'gray','color':'white'}}>
                    <Row style={{padding:'10px'}}>
                        <Col xs={{ order: 'first' }}>ABC Developers was founded by developers, for developers. It is now a valuable resource for people who want to make the most of their mobile devices, from customizing the look and feel to adding new functionality</Col>
                        <Col xs>Contact us with:
                        <br/>Email: dotuanthinh37.work@gmail.com<br/>Phone Number: +84335833737<br/>Address: 566 Nui Thanh, Hai Chau, TP Da Nang
                        </Col>
                        <Col xs={{ order: 'last' }}>
                            <div class="block">
                                <h3 class="block-minorHeader">Subscribe to our newsletter</h3>
                                Receive the freshest Android; development news right in your inbox!
                                <form class="xda_subscribeForm" action="" method="post" id="newsletters-2-form"/>
                                <input id="wpml-2email" type="text" name="email" class="input" placeholder="your@email"/>
                                <button type="submit" name="subscribe"><i class="mdi mdi-arrow-right"></i></button>
                                <input type="hidden" id="2list-list-select" name="list_id[]" value="3"/>
                            </div>
                        </Col>
                    </Row>                             
            </div>           
        </div>
    );
}
export default ShowType;