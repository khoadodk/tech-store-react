import React, { Component } from 'react';
import { linkData } from './linkData';
import { socialData } from './socialData';
import { items } from './productData';

const ProductContext = React.createContext();

class ProductProvider extends Component {
    state = {
        sidebarOpen: false,
        cartOpen: false,
        cartItems: 0,
        links: linkData,
        socialLinks: socialData,
        cart: [],
        cartTax: 0,
        cartTotal: 0,
        storeProducts: [],
        filteredProducts: [],
        featuredProducts: [],
        singleProducts: {},
        loading: true
    };

    componentDidMount() {
        this.setProducts(items);
    };
    
    setProducts = products => {
        let storeProducts = products.map(item => {
            const { id } = item.sys;
            const image = item.fields.image.fields.file.url
            const product = { id, ...item.fields, image };
            return product;
        })
        let featuredProducts = storeProducts.filter(item => item.featured === true);
        this.setState({
            storeProducts,
            filteredProducts: storeProducts,
            featuredProducts,
            cart: this.getStorageCart(),
            singleProduct: this.getStorageProduct(),
            loading: false
        })
    };
    //get Cart from local storage
    getStorageCart = () => {
        return [];
    }
    //get product from local storage
    getStorageProduct = () => {
        return [];
    }
    //get totals
    getTotals = () => {

    }
    // add totals
    addTotals = () => {

    }
    //sync storage
    syncStorage = () => {

    }
    //add to cart
    addToCart = (id) => {
        console.log(`add to cart ${id}`)
    }
    //set single product
    setSingleProduct = (id) => {
        console.log(`set single product ${id}`)
    }

    handleSidebar = () => this.setState({sidebarOpen: !this.state.sidebarOpen});

    handleCart = () => this.setState({cartOpen: !this.state.cartOpen});

    closeCart = () => this.setState({cartOpen: false});

    openCart = () => this.setState({cartOpen: true});

    render() {
        return (
            <ProductContext.Provider 
                value={{
                    ...this.state,
                    handleSidebar: this.handleSidebar,
                    handleCart: this.handleCart,
                    closeCart: this.closeCart,
                    openCart: this.openCart,
                    addToCart: this.addToCart,
                    setSingleProduct: this.setSingleProduct
                }}
            >
                {this.props.children}
            </ProductContext.Provider>
        )
    }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };