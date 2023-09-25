const inputData = {
    _id: "65087271e5fbbd897d655d21",
    userId: {
      createAt: "2023-09-21T18:05:22.208Z",
      abc :'1213',
    abcdef:"234"
      // ...
    },
    amount: 1000,
    createdAt: "2023-09-18T22:52:33.000Z",
    orderCode: 293428031863132900,
    signature: "a5ab4eabcca125b553e72085d795149ba022d16cc88d826ea10ee16c8000650e",
    status: "PAID",
    // ...
  };


  // Tạo một bản sao của đối tượng đầu vào
  const outputData = { ...inputData };
  
  // Lấy các trường trong userId
  const userIdProps = { ...outputData.userId };
  console.log(userIdProps,'userIdProps')
  // Xóa trường createAt trong userIdProps
  delete userIdProps.createAt;
  
  // Gán các trường trong userIdProps vào đối tượng đầu ra
  for (const key in userIdProps) {
    outputData[key] = userIdProps[key];
  }
  
  // Xóa userId khỏi đối tượng đầu ra
  delete outputData.userId;
  
  console.log(outputData);
  