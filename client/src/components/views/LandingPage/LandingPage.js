import React ,{useState, useEffect}from 'react'
import axios from 'axios';
import {Icon, Row, Card,Col} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';

function LandingPage() {

    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continents:[],
        price:[]
    })

    useEffect(() => {

        const variables = {
            skip:Skip,
            limit:Limit,
        }

        getProducts(variables)
    }, [])

    const getProducts=(variables) =>{
        axios.post('/api/product/getProducts',variables)
             .then(response =>{
                 if(response.data.success){

                    if(variables.loadMore){
                        setProducts([...Products, ...response.data.products])
                        
                    }else{
                        setProducts(response.data.products)
                    }
                    setPostSize(response.data.postSize)
                    
                 }else{
                     alert('Failed to fetch product datas')
                 }
             })
    }

    const onLoadMore =()=>{
        let skip = Skip + Limit;

        const variables = {
            skip:skip,
            limit:Limit,
            loadMore:true
        }
        getProducts(variables)

        setSkip(skip)
    }

    const renderCards = Products.map((product,index) =>{

            return <Col key={index} lg={6} md={8} xs={24}>

                        <Card
                            hoverable={true}
                            cover={<ImageSlider images={product.images}/>}
                        >

                        <Meta 
                            title={product.title}
                            description={`$${product.price}`}
                        />
                          
                        </Card>
                    </Col>
    })

    const showFilteredResults=(filters) =>{
        const variables ={
            skip:0,
            limit:Limit,
            filters:filters
        }

        getProducts(variables)
        setSkip(0)
    }

    const handleFilters= (filters, category) =>{
        console.log(filters)

        const newFilters = {...Filters}

        newFilters[category]= filters

        if(category === 'price'){

        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    return (
        <div style={{width:'75%', margin:'3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h2>Let's Travel Anywhere <Icon type='rocket'/> </h2>
            </div>

            {/*filter*/}
            
            <CheckBox handleFilters={filters => handleFilters(filters, 'continents')}/>

            {}

            {Products.length === 0 ? 
            
                <div style={{display:'flex', 
                            height:"300px", justifyContent:'center', alignItems:'center'}}>
                    <h2>No post yet...</h2>
                </div> :
                <div>
                    <Row gutter={[16,16]}>
                        {renderCards}
                    </Row>
                </div>    
            }

            <br/><br/>

            {PostSize >= Limit && 
            
                <div style={{display:'flex', justifyContent:'center'}}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
                
            }

           

        </div>
    )
}

export default LandingPage
