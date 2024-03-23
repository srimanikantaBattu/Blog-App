import "./Home.css";
import articleImage from "../../images/hello.mp4";

function Home() {
  return (
    <div className='articleHome'>
      {/* <h1 style={{color:'var(--crimson)'}}> Ocean of Knowledge</h1> */}
      {/* <img src={articleImage} alt="" className="artcleImage" /> */}
      <div className="svideo">
      <video src={articleImage} autoPlay loop muted className="fit-video" />
      <div className="vcontent">
      <h1>Welcome!</h1>
      <h3>Dive into the depths of imagination, where every page holds a new adventure and every word whispers a story waiting to be told.</h3>
    </div>
    </div>
      {/* <p className="lead">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore officia
        explicabo voluptatum excepturi dignissimos dolorum iste sed culpa nulla
        ab doloremque error placeat pariatur, similique facere soluta impedit
        inventore nam voluptas eum, laboriosam ipsam minus voluptatibus quaerat!
        Consequatur animi exercitationem accusantium repudiandae error
        voluptate, eveniet adipisci, fuga nostrum eligendi a harum! Atque, nihil
        eligendi labore, omnis, deleniti dolor est rem vitae id doloribus
        tempora distinctio excepturi cumque architecto. Repudiandae amet dolor
        voluptatibus ad in repellendus velit et, inventore, quo corrupti optio
        ab eum recusandae nisi error aut omnis. Fugiat dolore vero magni ea
        quibusdam commodi rem dolor repellendus. Voluptatem, assumenda.
      </p> */}
    </div>

  );
}

export default Home;