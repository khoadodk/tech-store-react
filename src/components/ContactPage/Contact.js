import React from 'react';
import Title from '../Title';

export default function Contact() {
    return (
        <section className='py-5'>
            <div className='row'>
                <div className='col-10 mx-auto col-md-6 my-3'>
                    <Title title='contact us' />
                    <form 
                        className='mt-5'
                        action='https://formspree.io/khoado.dk@gmail.com'
                        method='POST'
                    >
                        <div className='form-group'>
                            <input 
                                type='text' 
                                className='form-control' 
                                name='firstName' 
                                placeholder='John Doe' 
                            />
                        </div>
                        <div className='form-group'>
                            <input 
                                type='email' 
                                className='form-control' 
                                name='email' 
                                placeholder='YourEmail@email.com' 
                            />
                        </div>
                        <div className='form-group'>
                            <input 
                                type='text' 
                                className='form-control' 
                                name='subject' 
                                placeholder='Subject' 
                            />
                        </div>
                        <div className='form'>
                            <textarea 
                                name='message'
                                className='form-control'
                                rows='10'
                            >
                            </textarea>
                        </div>
                        <div className='form-group mt-3'>
                            <input
                                className='form-control bg-primary text-white'
                                type='submit'
                                value='Send'
                            />
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
