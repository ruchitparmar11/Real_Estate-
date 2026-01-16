import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, name, type }) => {
    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{title} | EstateAI</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
}

SEO.defaultProps = {
    title: 'Find Your Dream Home',
    description: 'EstateAI helps you find the best properties for sale and rent. Explore our listings today!',
    keywords: 'real estate, buy home, rent home, property, apartment, house',
    name: 'EstateAI',
    type: 'website'
};

export default SEO;
