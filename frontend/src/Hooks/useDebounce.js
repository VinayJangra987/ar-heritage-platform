import { useState, useEffect } from "react";

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
 
  return debouncedValue;
}

// function SearchBox() 
// { 
//   const [query,setQuery]=useState('');
//   const debounce=useDebounce(query);
//   useEffect(()=>{
//     if(!debounce)
//     {
//       return;
//     }
//     fetch(`/api/search?q=${debounce}`)
//     .then(res=>res.json())
//     .then(data=>console.log(data))
//   },[debounce])

//   return(
//   <input value={query} onChange={(e) => setQuery(e.target.value)} />
//   )
// }



// import {useState,useEffect} from 'react';

// export function useDebounce(value,delay=400){
//   const[debounce,setDebounce]=useState(value);

//   useEffect(()=>{
//     const Timer=setTimeout(()=>setDebounce(value),delay);
//     return ()=> clearTimeout(Timer)
//   },[value,delay])
// };


//  import {useRef,useCallback} from 'react';
// export function trotling(callback,limit=400){
//   const isThrotling=useref(false);
//   return callback((...args)=>{
//     if(isThrotling.current)
//       return;
//     callback(...args);
//     isThrotling.current=true;
//     setTimeout(()=>{
//       return isThrotling.current=false;
//     },limit)
//   },[callback,limit])
// }


//  import {useRef,useCallback} from 'react';
 
//  const Refresh=useRef(0);
//  export function Throttle(Callback,limit=400){
//   return useCallback((...args)=>{
//     const date=Date.now();
//     if(date-Refresh.current>=limit)
//     {
//       Refresh.current=date;     
//       Callback(...args);
//     }
//   },[Callback,limit])
//  }


// import {useState,useEffect} from 'react';

// export default function debouncing(value,delay=400){
//   const [debounced,setdebounced]=useState(0);
//   useEffect(()=>{
//     const timer =setTimeout(()=>setdebounced(value),delay);
//     return ()=>clearTimeout(timer);
//   },[value,delay])

//   return debouncing;
// };
// // const express=(userID)=>{return jwt.sign({payload},secret,{options})}

// function generateAccessToken(userId) {
//   return jwt.sign({id:userId},Secret,{expiresIn:"15min"});
// }
// function generateRefreshToken(userId) {
//  return jwt.sign({id:userId},Secret,{expiresIn:"7d"});
// }

// function authMiddleware(req, res, next) {
//   const authHeader = req.headers['authorization'];

//   if(!authHeader)
//   {
//     return res.status(401).json({ message: "Token nahi mila" });
//   }

//    const token = authHeader.split(' ')[1];
//    try{
//     const decoded= jwt.verify(token, secret)
//     req.user=decoded;
//     next();
//    }
//    catch (err) {
//     return res.status(401).json({ message: "Token invalid ya expired hai" });
//   }
  
// }
// function SearchBox() {
//   const [query, setQuery] = useState('');
//   const debouncedQuery = useDebounce(query, 500);

//   useEffect(() => {
//     if (!debouncedQuery) return; 

//     console.log("Fetching results for:", debouncedQuery);
//     fetch(`/api/search?q=${debouncedQuery}`)
//       .then(res => res.json())
//       .then(data => console.log(data));
//   }, [debouncedQuery]);

//   return (
//     <input value={query} onChange={(e) => setQuery(e.target.value)} />
//   );
// }

// 5. useDebouncedCallback banao (value ki jagah pura function debounce karo)

// javascript
// function useDebouncedCallback(callback, delay) {
//   // hint: useRef se timer store karo, useCallback return karo
// }