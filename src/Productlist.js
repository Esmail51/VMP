import React, { useState, useEffect } from "react";
import './App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import editIcon from './assets/img/edit.png'
import deleteIcon from './assets/img/delete.png';
import { useTranslation } from 'react-i18next';
import listImg from './assets/img/productList-Img.png';
import removeIcon from './assets/img/cancel.png'




function ProductList() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [Product, setProduct] = useState([])
    const [reload, setReload] = useState(false);
    const top_content = {
        fontSize: "20px",
        fontWeight: "600",
        textAlign: "center"
    }
    useEffect(() => { getProduct() }, [reload])
    const getProduct = async () => {
        const vendor_id = localStorage.getItem('local-vendor-id')
        const Response = await axios.get(`http://localhost:5000/getproductlist/${vendor_id}`)
        const product = Response.data.products
        const allProducts = []
        product.forEach(element => {
            allProducts.push(element)
        });
        setProduct(allProducts)

    }

    const UpdateKey = async (data, index) => {
        console.log('data', data, 'index', index)
        if (data) {
            navigate('/Product', { state: { data: data, Update: true } });
        }
    }

    const DeleteKey = async (data, index) => {
        try {
            const Response = await axios.delete(`http://localhost:5000/deleteProduct?product_id=${data.product_id}`)
            if (Response.status === 200) {
                setReload(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const Addproduct = (e) => {
        e.preventDefault();
        navigate('/Product');
    }


    return (
        <div style={{padding:'40px'}}>
            <div style={top_content}>
                <img src={listImg} alt="" width={350}></img>
                <p style={{ color: "#8e37ff" }}>{t('Product_List')}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                <table>
                    <tbody>
                        {Product.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td style={{width:'50px'}}><div style={{width:'80px', padding:'5px', border:'1px solid #E6E6E6'}}><img src={listImg} alt="" className="img-max"></img>
                                    </div></td>
                                    <td style={{textAlign:'start'}}>{val.product_name}</td>
                                    <td><img src={editIcon} width={25} alt="edit" style={{ marginRight: '15px' }} onClick={() => UpdateKey(val, key)} ></img>
                                        <img src={removeIcon} width={25} alt="delete" onClick={() => DeleteKey(val, key)}></img>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <button onClick={Addproduct}>+{t('Add_Product')}</button>
            </div>
        </div>
    )
}

export default ProductList