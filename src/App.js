import React, { useEffect } from 'react';
import MapComponent from './MapComponent';
import { firestore } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function App() {
  useEffect(() => {
    console.log("Firestore 인스턴스:", firestore);

    // "nodes" 컬렉션 가져오기
    const nodeCollection = collection(firestore, "nodes");

    // Firestore에서 데이터 가져오기
    const fetchNodes = async () => {
        const querySnapshot = await getDocs(nodeCollection);
        querySnapshot.forEach((doc) => { //사용하여 각 문서를 순회하며 데이터를 출력합니다.
          // document 데이터와 ID 출력 
          console.log("Document ID:", doc.id);
          console.log("Document Data:", doc.data());
        });
    };

    fetchNodes(); // 데이터 가져오는 함수 실행
  }, []); // 빈 배열로 초기 렌더링 시 한 번만 실행

  return (
    <div className="App">
      <h1>에어스팟</h1>
      <MapComponent />
    </div>
  );
}

export default App;

/*
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "./firebase";

const addTestData = async () => {
  try {
    const docRef = await addDoc(collection(firestore, "nodes"), {
      name: "Test Node",
      value: 42,
    });
    console.log("Document written with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

addTestData();
firebase에 데이터 추가하는 방법
*/