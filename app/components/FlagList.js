import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { setFlags, setPostsList } from '../actions';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  {
    id: 'postId',
    numeric: false,
    disablePadding: true,
    label: 'Post'
  },
  { id: 'date', numeric: true, disablePadding: false, label: 'Date' },
  { id: 'user', numeric: true, disablePadding: false, label: 'User' },
  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  { id: 'reason', numeric: true, disablePadding: false, label: 'Reason' }
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map(headCell => (
          <TableCell
            className={classes.tablecell}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight: {
    color: '#757575',
    backgroundColor: lighten('#757575', 0.85)
  },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: '#757575'
  },
  title: {
    flex: '0 0 auto'
  }
}));

const useTooltipStyles = makeStyles(() => ({
  tooltip: {
    fontSize: '1rem'
  }
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const tooltipClasses = useTooltipStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : null}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip
            classes={tooltipClasses}
            title="Delete"
            onClick={props.handlePostDelete}
          >
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handlePostDelete: PropTypes.func.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    boxShadow: 'none'
  },
  table: {
    minWidth: 750
  },
  tablecell: {
    fontSize: '1.2rem'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}));

const mapStateToProps = state => {
  return {
    flags: state.flags,
    isAdmin: state.user.admin
  };
};

const FlagList = props => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('date');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    retrieveFlags();
  }, []);

  const retrieveFlags = () => {
    axios.get('/api/post/flag/list').then(res => {
      if (res.data.length) {
        props.dispatch(
          setFlags(
            res.data.map(flag => {
              return {
                ...flag,
                date: new Date(flag.createdAt).toLocaleDateString(),
                active: flag.post.active,
                user: { id: flag.userId, username: flag.user.username }
              };
            })
          )
        );
      }
    });
  };

  const handlePostDelete = e => {
    e.preventDefault();
    const selectedFlag = props.flags[selected];

    axios({
      url: `/api/post/delete/${selectedFlag.postId}`,
      method: 'post'
    })
      .then(() => {
        toast.success('Post deleted.');
        props.dispatch(setPostsList([]));
        setSelected([]);
        retrieveFlags();
      })
      .catch(error => {
        toast.error(error.response.data);
      });
  };

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    if (!props.isAdmin) return;
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected.push(name);
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  return (
    <section id="flag-list">
      <ToastContainer />
      <h1>
        <span>Flags</span>
      </h1>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            handlePostDelete={handlePostDelete}
          />
          <div className={classes.tableWrapper}>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="medium"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={() => {}}
                onRequestSort={handleRequestSort}
                rowCount={props.flags.length}
              />
              <TableBody>
                {stableSort(props.flags, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(index);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={event => handleClick(event, index)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          {props.isAdmin ? (
                            <Checkbox
                              style={{ color: '#757575' }}
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          ) : null}
                        </TableCell>
                        <TableCell
                          className={classes.tablecell}
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          <Link to={`/post/${row.postId}`}>{row.postId}</Link>
                        </TableCell>
                        <TableCell className={classes.tablecell} align="right">
                          {row.date}
                        </TableCell>
                        <TableCell className={classes.tablecell} align="right">
                          <Link to={`/user/${row.user.id}`}>
                            {row.user.username}
                          </Link>
                        </TableCell>
                        <TableCell className={classes.tablecell} align="right">
                          {row.active ? 'Active' : 'Deleted'}
                        </TableCell>
                        <TableCell className={classes.tablecell} align="right">
                          {row.reason}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={props.flags.length}
            rowsPerPageOptions={[rowsPerPage]}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'previous page'
            }}
            nextIconButtonProps={{
              'aria-label': 'next page'
            }}
            onChangePage={handleChangePage}
          />
        </Paper>
      </div>
    </section>
  );
};

FlagList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flags: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(FlagList);
