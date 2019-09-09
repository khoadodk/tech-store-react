import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from './pages/HomePage';
import About from './pages/AboutPage';
import Products from './pages/ProductsPage';
import Contact from './pages/ContactPage';
import SingleProductPage from './pages/SingleProductPage';
import Cart from './pages/CartPage';
import Default from './pages/Default';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import SideCart from './components/SideCart';
import Footer from './components/Footer';

import { Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <>
      <NavBar />
      <SideBar />
      <SideCart />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/products/:id" component={SingleProductPage} />
        <Route exact path="/cart" component={Cart} />
        <Route component={Default} />
      </Switch>
      <Footer />
      </>
    )
  }
}

export default App;
