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
        cartSubtotal: 0,
        storeProducts: [],
        filteredProducts: [],
        featuredProducts: [],
        singleProduct: {},
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
        }, () => {
            this.addTotals();
        })
    };
    //get Cart from local storage
    getStorageCart = () => {
        let cart;
        if(localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"));
        } else {
            cart = [];
        }
        return cart;
    }
    //get product from local storage
    getStorageProduct = () => {
        return localStorage.getItem("singleProduct") 
            ? JSON.parse(localStorage.getItem("singleProduct"))
            : {};
    }
    //get totals
    getTotals = () => {
        let subTotal = 0;
        let cartItems = 0;
        this.state.cart.forEach(item => {
            subTotal += item.total;
            cartItems += item.count;
        });
        subTotal = parseFloat(subTotal.toFixed(2));
        let tax = subTotal * 0.2;
        tax = parseFloat(tax.toFixed(2));
        let total = subTotal + tax;
        total = parseFloat(total.toFixed(2));
        return {
            cartItems,
            subTotal,
            tax,
            total
        }
    }
    // add totals
    addTotals = () => {
        const totals = this.getTotals();
        this.setState({
            cartItems: totals.cartItems,
            cartSubtotal: totals.subTotal,
            cartTax: totals.tax,
            cartTotal: totals.total
        })
    }
    //sync storage
    syncStorage = () => {
        localStorage.setItem("cart", JSON.stringify(this.state.cart));
    }
    //add to cart
    addToCart = (id) => {
        let existingCart = [...this.state.cart];
        let existingProducts = [...this.state.storeProducts];
        let existingItem = existingCart.find(item => item.id === id);
        //if item is not in the cart, add count and total to cart
        if(!existingItem) {
            existingItem = existingProducts.find(item => item.id === id);
            let total = existingItem.price;
            let cartItem = { ...existingItem, count: 1, total };
            existingCart = [ ...existingCart, cartItem]
        } else {
            existingItem.count++;
            existingItem.total = existingItem.price * existingItem.count;
            existingItem.total = parseFloat(existingItem.total.toFixed(2));
        }
        this.setState(
            () => {
                return { cart: existingCart };
            },
            () => {
                this.addTotals();
                this.syncStorage();
                this.openCart();
            }
        )
    }
    //set single product
    setSingleProduct = (id) => {
        let product = this.state.storeProducts.find(item => item.id === id)
        localStorage.setItem("singleProduct", JSON.stringify(product));
        this.setState({
            singleProduct: {...product},
            loading: false
        })
    }

    handleSidebar = () => this.setState({sidebarOpen: !this.state.sidebarOpen});

    handleCart = () => this.setState({cartOpen: !this.state.cartOpen});

    closeCart = () => this.setState({cartOpen: false});

    openCart = () => this.setState({cartOpen: true});

    //Cart functionality
    increment = id => {
        let tempCart = [...this.state.cart];
        const cartItem = tempCart.find(item => item.id === id);
        cartItem.count++;
        cartItem.total = cartItem.count * cartItem.price;
        cartItem.total = parseFloat(cartItem.total.toFixed(2));
        this.setState({
            cart: [...tempCart]
        }, () => {
            this.addTotals();
            this.syncStorage()
        })
    }
    decrement = id => {
        let tempCart = [...this.state.cart];
        const cartItem = tempCart.find(item => item.id === id);
        if(cartItem.count === 0){
            this.removeItem(id)
        } else {
            cartItem.count--;
            cartItem.total = cartItem.count * cartItem.price;
            cartItem.total = parseFloat(cartItem.total.toFixed(2));
            this.setState({
                cart: [...tempCart]
            }, () => {
                this.addTotals();
                this.syncStorage()
            })
        }
    }
    removeItem = id => {
        let tempCart = [...this.state.cart];
        tempCart = tempCart.filter(item => item.id !== id);
        this.setState({
            cart: [...tempCart]
        },() => {
            this.addTotals();
            this.syncStorage()
        })
    }
    clearCart = () => {
        this.setState({
            cart: []
        }, () => {
            this.addTotals();
            this.syncStorage()
        })
    }

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
                    setSingleProduct: this.setSingleProduct,
                    //Cart functionality
                    increment: this.increment,
                    decrement: this.decrement,
                    removeItem: this.removeItem,
                    clearCart: this.clearCart
                }}
            >
                {this.props.children}
            </ProductContext.Provider>
        )
    }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };