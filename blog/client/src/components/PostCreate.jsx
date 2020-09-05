import React, { useState } from 'react';
import axios from 'axios';


const PostCreate = () => {
  const [title, setTitle] = useState('test');

  const onSubmit = async (event) => {
    event.preventDefault();

    await axios.post('http://posts.com/posts/create', { title });
    setTitle('');
  };

  return <div>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input 
          type="text" 
          value={title}
          onChange={e => setTitle(e.target.value)} 
          className="form-control"
        />
      </div>
      <button className="btn btn-primary">Submit</button>
    </form>
  </div>;
};

export { PostCreate };
