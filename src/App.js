import './App.css';
import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const apiKey = 'b9b19d5f';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
}));

export default function App() {
  const classes = useStyles();
  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap>
              <Link className={classes.link} to="/">React Movie Database</Link>
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          </Toolbar>
        </AppBar>
      </div>

      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/movie/:id" component={SingleMovie}></Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

class Home extends Component {
  state = {
    movies: [],
  };

  componentDidMount() {
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=avengers`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            movies: result.Search
          });
          console.log(result.Search);
        },
        (error) => {
          console.log(error);
        }
      )
  }
  render() {
    return (
      <Grid className="movieContainer" container spacing={3}>
        {this.state.movies.map(function (movie, index) {
          return <Grid item xs={12} lg={2}><MovieThumbnail {...movie}></MovieThumbnail></Grid>
        })}
      </Grid>
    );
  }
}


class MovieThumbnail extends Component {
  render() {
    return (
      <div>
        <div className="movieThumbnail">
          <Link to={'/movie/' + this.props.imdbID}><img className="moviePoster" alt={this.props.Title} src={this.props.Poster} /></Link>
          <Link className="movieTitle" to={'/movie/' + this.props.imdbID}><p>{this.props.Title}</p></Link>
        </div>
      </div>
    );
  }
}

class SingleMovie extends Component {
  state = {
    movie: {},
  };
  componentDidMount() {
    fetch(`http://www.omdbapi.com/?i=${this.props.match.params.id}&plot=full&apikey=${apiKey}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            movie: result
          });
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      )
  }
  render() {
    // if (this.movie === undefined) {
    //   return (
    //     <div>Loading {this.movie}</div>
    //   );
    // } else {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} p={10}>
            <Box p={4} >
              <img className="moviePoster" alt={this.state.movie.Title} src={this.state.movie.Poster} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={9}>
            <Box p={4} >
              <h2 className="singlemoviedetail title">{this.state.movie.Title} ({this.state.movie.Year})</h2>
              <div className="singlemoviedetail">{this.state.movie.Genre}</div>
              <div className="singlemoviedetail">{this.state.movie.Director}</div>
              <div className="singlemoviedetail">{this.state.movie.Actor}</div>
              <div className="singlemoviedetail">{this.state.movie.Plot}</div>
            </Box>
          </Grid>
        </Grid>
      );
    }
  // } 
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
