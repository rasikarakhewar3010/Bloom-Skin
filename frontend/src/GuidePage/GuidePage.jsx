import React from 'react';
import Hero from './Hero';
import { NavbarDemo } from '@/NavbarDemo';
import { Steps } from './steps';
import BloomSkinFooter from '@/HomePage/BloomSkinFooter';
import ChatBot from '@/HomePage/ChatBot';
import BloomSkinDosDonts from './BloomSkinDosDonts';

const GuidePage = () => {
    return (
        <>
            <NavbarDemo />
            <Hero />
            <Steps />
            <BloomSkinDosDonts />
            <BloomSkinFooter />
            <ChatBot />

        </>
    );
};

export default GuidePage;