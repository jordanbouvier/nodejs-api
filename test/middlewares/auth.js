import { expect } from 'chai'; 
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import "@babel/polyfill";

import { isAuth, getDecodedToken, hasRole } from '../../src/middlewares/auth';
import { HttpException } from '../../src/utils/errors';

describe('Auth middleware', () => {
  describe('getDecodedToken', () => {
    it('No authorization header', () => {
      const req = {
        get: function(headerName) {
          return this.headers[headerName];
        },
        headers: {
  
        }
      }
      const dToken = getDecodedToken(req);
      expect(dToken).to.be.false;    
      
    });
    it('Empty authorization header', () => {
      const req = {
        get: function(headerName) {
          return this.headers[headerName];
        },
        headers: {
          Authorization: ''
        }
      }
      const dToken = getDecodedToken(req);
      expect(dToken).to.be.false;
    })
    it('Empty token', () => {
      const req = {
        get: function(headerName) {
          return this.headers[headerName];
        },
        headers: {
          Authorization: 'Bearer',
        }
      }
      const dToken = getDecodedToken(req);
      expect(dToken).to.be.false;
    })
    it('Invalid token', () => {
      const req = {
        get: function(headerName) {
          return this.headers[headerName];
        },
        headers: {
          Authorization: 'Bearer dfjlmdsqljds',
        }
      }
      const dToken = getDecodedToken(req);
      expect(dToken).to.be.false;
    })
    it('Valid token', () => {
      const key = 'supersecret';
      const token = jwt.sign({
        userId: 'someId',
      }, key)    
  
  
      const req = {
        get: function(headerName) {
          return this.headers[headerName];
        },
        headers: {
          Authorization: 'Bearer ' + token,
        }
      }
      const fakeTokenResult = jwt.verify(token, key);
  
      sinon.stub(jwt, 'verify');
      jwt.verify.returns(fakeTokenResult);
  
      
      const dToken = getDecodedToken(req);
      
  
      expect(dToken).to.be.equals(fakeTokenResult);
    
    });
  }) 
  describe('hasRole', () => {
    it('should throw an error', () => {
      const req = {
        user: {
          roles: []
        }        
      }
      const cb = hasRole('ROLE_TEST');
      const next = (error) => { if(error) {throw error} };
      expect(() => {
        cb(req, {}, next)
      }).to.throw(HttpException);

    })
    it('should be ok', () => {
      const req = {
        user: {
          roles: ['ROLE_TEST']
        }        
      }
      const cb = hasRole('ROLE_TEST');

      const next = (error) => { if(error) {throw error} };

      expect(() => {
        cb(req, {}, next)
      }).not.to.throw();
    })
  }) 
  describe('isAuth', () => {
    it('Expired token', () => {
      const req = {
        user: { _id: 'djflksdj' },
        token: { userId: 'djflksdj', exp: (new Date().getTime() / 1000) - 3700 }
      }
      expect(() => {
        isAuth(req, {}, ()=> {})
      }).to.throw(HttpException);
    })
    it('No user, no token', () => {      
      expect(() => {
        isAuth({}, {}, ()=> {})
      }).to.throw(HttpException);
    })
    it('User but no token', () => {
      expect(() => {
        isAuth({ user: { _id: 'dummyid'}}, {}, ()=> {})
      }).to.throw(HttpException);
    })
    it('Valid data', () => {
      const req = {
        user: { _id: 'djflksdj' },
        token: { userId: 'djflksdj', exp: (new Date().getTime() / 1000) + 3600}
      }
      expect(() => {
        isAuth(req, {}, ()=> {})
      }).not.to.throw();
    })
  })
  

})