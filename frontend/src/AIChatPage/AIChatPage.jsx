import ImageUpload from '@/components/ImageUpload';
import BloomSkinFooter from '@/HomePage/BloomSkinFooter';
import ChatBot from '@/HomePage/ChatBot';
import { NavbarDemo } from '@/NavbarDemo';
import React from 'react';

const AIChatPage = () => {
    return (
        <>
        <NavbarDemo/>
        <ImageUpload/>
        <BloomSkinFooter/>
        <ChatBot/>
        </>
    );
};

export default AIChatPage;