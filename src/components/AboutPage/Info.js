import React from 'react';
import Title from '../Title';
import aboutBcg from '../../images/aboutBcg.jpeg';

export default function Info() {
    return (
        <section className='py-5'>
            <div className='container'>
                <div className='row'>
                    <div className='col-10 mx-auto col-md-6 my-3'>
                        <img 
                            src={aboutBcg} 
                            alt='About company' 
                            className='img-fluid img-thumbnail'
                            style={{ background: 'var(--darkGrey)' }} 
                        />
                    </div>
                    <div className='col-10 mx-auto col-md-6 my-3'>
                        <Title title='about us' />
                        <p className='text-lead text-muted my-3'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                        </p>
                        <p className='text-lead text-muted my-3'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <button className='main-link' type='button' style={{ marginTop:'2rem' }}>more info</button>
                    </div>
                </div>
            </div>
        </section>
    )
}
