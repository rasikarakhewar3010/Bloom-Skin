import ImageUpload from '@/components/ImageUpload';
import ChatBot from '@/HomePage/ChatBot';
import { NavbarDemo } from '@/NavbarDemo';
import React from 'react';

const AIChatPage = () => {
    return (
        <>
        <NavbarDemo/>
        <ImageUpload/>
        <ChatBot/>
        </>
    );
};

export default AIChatPage;