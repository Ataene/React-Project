import React, { Component } from "react";
import Header from "./HeaderComponent";
import Footer from "./FooterComponent";
import Home from "./HomeComponent";
import About from "./AboutComponent"; //About us page 
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Contact from "./ContactComponents";
import Directory from "./DirectoryComponent";
import CampsiteInfo from "./CampsiteInfoComponent";
import { addComment, fetchCampsites } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
//All the above was transfered to the NEW REDUX FOLDER TO HANDLE.
// import { CAMPSITES } from "../shared/campsites";
// import { COMMENTS } from "../shared/comments";
// import { PARTNERS } from "../shared/partners";
// import { PROMOTIONS } from "../shared/promotions";



const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        partners: state.partners,
        promotions: state.promotions
    }
}

const mapDispatchToProps = {
    addComment: (campsiteId, rating, author, text) => (addComment(campsiteId, rating, author, text)),
    fetchCampsites: () => (fetchCampsites()),
    resetFeedbackForm: () => (actions.reset('feedbackForm'))
};


class Main extends Component {
    // constructor(props){    //Deleted to accommodate REDUX.
    //     super(props);
    //     this.state = {
    //         campsites:CAMPSITES,
    //         comments: COMMENTS,
    //         partners: PARTNERS,
    //         promotions: PROMOTIONS
    //     };
    // }

    componentDidMount() {
        this.props.fetchCampsites();
    }

    render(){

        const HomePage = () => {
            return (
                <Home
                    campsite={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]}
                    campsitesLoading={this.props.campsites.isLoading}
                    campsitesErrMess={this.props.campsites.errMess}
                    promotion={this.props.promotions.filter(promotion => promotion.featured)[0]}
                    partner={this.props.partners.filter(partner => partner.featured)[0]}
                />
            );
        }

        const CampsiteWithId = ({match}) => {
            return (
                <CampsiteInfo 
                    campsite={this.props.campsites.campsites.filter(campsite => campsite.id === +match.params.campsiteId)[0]}
                    isLoading={this.props.campsites.isLoading}
                    errMess={this.props.campsites.errMess}
                    comments={this.props.comments.filter(comment => comment.campsiteId === +match.params.campsiteId)}
                    addComment={this.props.addComment}
                />
            );
        };

        return (
            <div>
                <Header />
                <Switch>
                    <Route path='/home' component={HomePage} />
                    <Route exact path='/directory' render={() => <Directory campsites={this.props.campsites} />} />
                    <Route path='/directory/:campsiteId' component={CampsiteWithId} />
                    <Route exact path='/contactus' render={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} />} />
                    <Route exact path='/aboutus' render={() => <About partners={this.props.partners} /> } />
                    <Redirect to='/home' />
                </Switch>
                <Footer />
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));