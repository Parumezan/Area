const Index = () => {
  function test() {
    console.log(process.env.NEXT_PUBLIC_BACK_URL);
  }

  test();

  return <div>HELLO WORLD</div>;
};

export default Index;
