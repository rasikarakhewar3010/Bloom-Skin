import React from 'react';
import { HeroSectionOne } from './HeroSectionOne';
import { NavbarDemo } from './NavbarDemo';
import ScanIntro from './ScanIntro';
import { StickyScrollRevealDemo } from './StickyScrollRevealDemo';
import WhyChooseBloomSkin from './WhyChooseBloomSkin';
import BloomSkinFooter from './BloomSkinFooter';
// import Features from './Features';

const HomePage = () => {
    return (
        <>
            <NavbarDemo />
            <HeroSectionOne className="" />
            <ScanIntro />
            <StickyScrollRevealDemo />
            <WhyChooseBloomSkin/>
            <BloomSkinFooter/>
        </>
    );
};

export default HomePage;