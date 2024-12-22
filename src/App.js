import React from 'react';
import MapComponent from './MapComponent';
import { firestore } from "./firebase";
import { useEffect } from 'react';

function App() {
  // Firestore와 관련된 동작을 useEffect에서 실행
  useEffect(() => {
    console.log("Firestore 인스턴스:", firestore);

    // 예를 들어, Firestore 컬렉션 데이터 가져오기
    // 아래는 Firestore에서 데이터를 읽는 예제입니다.
    // import { collection, getDocs } from "firebase/firestore";
    // const fetchData = async () => {
    //   const querySnapshot = await getDocs(collection(firestore, "your-collection-name"));
    //   querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} =>`, doc.data());
    //   });
    // };
    // fetchData();

  }, []); // 빈 배열을 의존성으로 추가하여 useEffect가 한 번만 실행되도록 설정

  return (
    <div className="App">
      <h1>에어스팟</h1>
      <MapComponent />
    </div>
  );
}

export default App;
