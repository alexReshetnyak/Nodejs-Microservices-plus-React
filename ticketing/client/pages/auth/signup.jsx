import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <h1>Sign Up</h1>

      <div className='form-group'>
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type='text'
          className='form-control'
        />
      </div>

      <div className='form-group'>
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          className='form-control'
        />
      </div>

      {errors}

      <button className='btn btn-primary'>Sign Up</button>
    </form>
  );
};

export default SignUp;
