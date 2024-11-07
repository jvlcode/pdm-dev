import React from 'react';
import RFQList from './RFQList';


function Home({collection}) {
    return <>
      <div className='flex justify-between mt-5 mx-5'>
            <div>
                <h1 className="text-white text-3xl font-bold mb-6">RFQ List</h1>
            </div>
        </div>
        <div className='text-white mt-3'>
            <RFQList/>
        </div>
    </>
}

export default Home;
