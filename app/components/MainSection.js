import React, { Component, PropTypes } from 'react';
import TodoItem from './TodoItem';
import Footer from './Footer';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';
import style from './MainSection.css';
import _ from 'lodash';

const IMAGES = [
  "https://sprcdn-nqa-sam.sprinklr.com/5/cricket_%282%29-d98432f9-3fbb-4827-85b5-74098a00b0a6-2056611677_p.jpg",
  "https://sprcdn-nqa-sam.sprinklr.com/5/wallpapers-7020-7277-hd-wallpa-53b11c2d-42f8-4f76-b561-afe6e2f2c6c1-1988741213_p.jpg",
  "https://sprcdn-nqa-sam.sprinklr.com/5/SMB034-a43b99c7-219b-43b2-b524-3273b5696f1b-644337444_p.jpg",
  "https://sprcdn-nqa-sam.sprinklr.com/5/watch_dogs_27-wallpaper-1440x9-fad21dbf-a9ba-4c93-b8cf-54d344ed933a-446840274_p.jpg",
  "https://sprcdn-nqa-sam.sprinklr.com/5/verizon-wireless-store-2877182-69c662d2-5a11-4a1e-a03c-7463018ff7c3-1675114908_p.jpg"
];

class MainSection extends React.Component {
  constructor() {
    super();
    this.state = { currentSelected : 0 , title : 'Hello'}
  }

  componentWillMount() {
    const currentTab = _.get(this.state , 'currentTab' , {});
    if(_.isEmpty(currentTab)) {
          chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
            this.setState({title : tabs[0].title});
        });
    }
  }

  render() {
    return (
      <div className={style.uploadCtn}>
        {this.renderImageSection()}
        {this.renderDetailsSection()}
        {this.renderFooterSection()}
      </div>
    );
  }

  renderImageSection() {
    const { currentSelected } = this.state;

    return (
      <div className="ucImgCtn">
        <div className={style.ucSelectedImgOuterCtn}>
          <label className={style.ucSiocPhotoLabel}>PHOTO</label>
          <div className={style.ucSelectedImgInnerCtn} style={{backgroundImage : `url('${IMAGES[currentSelected]}')`}}></div>
        </div>
        <div className={style.otherImgOuterCtn}>
          <label className={style.ucSiocPhotoLabel}>Select other Image</label>
          <div className={style.otherImgCtn}>
          {_.map(_.omit(IMAGES,currentSelected) , (image, index) => {
                return this.renderImage(image , index);
          })}
          </div>
        </div>
      </div>
    );
  }

  renderImage(image , index) {
    return <div className={style.otherImg} data-index={index} key={index} style={{backgroundImage : `url('${image}')`}} onClick={this.setCurrent}></div>
  }

  renderDetailsSection() {
    const { title } = this.state;
    return (
      <div className="uc-details-ctn">
        <label className={style.ucDcLabel}>TITLE</label>
        <textarea value={title} className={style.ucDcTitleText} onChange={this.handleChange}></textarea>
        <label className={style.ucDcLabel}>DESCRIPTION</label>
        <textarea className={style.ucDcTitleText}
                  placeholder="Describe this Image"/>
        <label className={style.ucDcLabel}>NOTE</label>
        <textarea className={style.ucDcTitleText}
                  placeholder="Add a note"/>
      </div>
    );
  }

  renderFooterSection() {
    return(
      <div className={style.footer}>
      <button className={style.uploadButton}>Upload</button>
      </div>
    )
  }

  getTitle() {
    const { currentTab } = this.state;
    if(!_.isEmpty(currentTab)) {
      return currentTab.title;
    }
    return 'Hello';
  }

  setCurrent = (event) => {
    const data = event.currentTarget.dataset;
    this.setState({currentSelected: data.index});
  }

  handleChange = (event) => {
    const { value } = event.target;
    this.setState({
      title : value
    })
  }
}

export default MainSection;

// const TODO_FILTERS = {
//   [SHOW_ALL]: () => true,
//   [SHOW_ACTIVE]: todo => !todo.completed,
//   [SHOW_COMPLETED]: todo => todo.completed
// };
//
// export default class MainSection extends Component {
//
//   static propTypes = {
//     todos: PropTypes.array.isRequired,
//     actions: PropTypes.object.isRequired
//   };
//
//   constructor(props, context) {
//     super(props, context);
//     this.state = { filter: SHOW_ALL };
//   }
//
//   handleClearCompleted = () => {
//     const atLeastOneCompleted = this.props.todos.some(todo => todo.completed);
//     if (atLeastOneCompleted) {
//       this.props.actions.clearCompleted();
//     }
//   };
//
//   handleShow = filter => {
//     this.setState({ filter });
//   };
//
//   renderToggleAll(completedCount) {
//     const { todos, actions } = this.props;
//     if (todos.length > 0) {
//       return (
//         <input
//           className={style.toggleAll}
//           type="checkbox"
//           checked={completedCount === todos.length}
//           onChange={actions.completeAll}
//         />
//       );
//     }
//   }
//
//   renderFooter(completedCount) {
//     const { todos } = this.props;
//     const { filter } = this.state;
//     const activeCount = todos.length - completedCount;
//
//     if (todos.length) {
//       return (
//         <Footer
//           completedCount={completedCount}
//           activeCount={activeCount}
//           filter={filter}
//           onClearCompleted={this.handleClearCompleted}
//           onShow={this.handleShow}
//         />
//       );
//     }
//   }
//
//   render() {
//     chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
//       console.log(tabs[0].url , "tabs");
//     });
//     const { todos, actions } = this.props;
//     const { filter } = this.state;
//
//     const filteredTodos = todos.filter(TODO_FILTERS[filter]);
//     const completedCount = todos.reduce(
//       (count, todo) => (todo.completed ? count + 1 : count),
//       0
//     );
//
//     return (
//       <section className={style.main}>
//         {this.renderToggleAll(completedCount)}
//         <ul className={style.todoList}>
//           {filteredTodos.map(todo =>
//             <TodoItem key={todo.id} todo={todo} {...actions} />
//           )}
//         </ul>
//         {this.renderFooter(completedCount)}
//       </section>
//     );
//   }
// }
