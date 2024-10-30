import { SwipeAble } from "../lib/index.ts"
import './App.css'

const ITEMS = [
  {
    id: 1,
    title: 'This is react deck swiper',
    text: 'It allows you to build tinder-like swipeable cards easily',
    url: 'https://images.unsplash.com/photo-1496248051939-0382a018e59a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 2,
    title: 'and it\'s awesome!',
    text: 'So, what are you waiting for? 🚀',
    url: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
  },
]

function App() {

  const item = ITEMS[0]
  return (
    <main>
      {/* {ITEMS.map((item) => {
        return ( */}
          <SwipeAble key={item.id}>
            <div className="card">

              <h2>{item.title}</h2>
              <h4>{item.text}</h4>
              <img src={item.url} alt={item.title} />
            </div>
          </SwipeAble>
        {/* )
      })} */}
    </main>
  )
}

export default App
