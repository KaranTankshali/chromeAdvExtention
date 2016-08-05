import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import style from './MainSection.scss';
import _ from 'lodash';
import axios from 'axios';

let thumbnailImages = [], source, profileImageUrl, fullName;
class MainSection extends React.Component {
    constructor() {
        super();
        this.state = {
            currentSelected: 0,
            title: '',
            desc: '',
            isUploading: false,
            contentUploaded: false,
            hasTitleError: false,
            fetchingLinkPreview: false,
            fetchingUserDetails: false
        }
    }

    componentWillMount() {
        const currentTab = _.get(this.state, 'currentTab', {});
        this.fetchUserData();
        if (_.isEmpty(currentTab)) {
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
                this.fetchLinkData(tabs);
            });
        }
    }

    render() {
        const { contentUploaded ,title , fetchingLinkPreview , fetchingUserDetails } = this.state;
        if (contentUploaded) {
            this.handleContentUploaded();
            return (
                <div className={style.thanksMsg}>
                    <div className={style.checkUpload}>
                    </div>
                    <div className={style.uploadHeading}>
                        Uploaded successfully!
                    </div>
                    <div className={style.uploadText}>
                        The article {title} has been uploaded successfully to Verizon advocacy.
                    </div>
                </div>
            );
        } else if (fetchingLinkPreview || fetchingUserDetails) {
            return (
                <div>Loading...</div>
            );
        }
        return (
            <div className={style.uploadCtn}>
                {this.renderProfileSection()}
                {this.renderImageSection()}
                {this.renderDetailsSection()}
                {this.renderFooterSection()}
            </div>
        );
    }

    renderProfileSection() {
        return (
            <div className={style.topbar}>
                <div className={style.userCtn}>
                    <div className={style.profileImgCtn}>
                        <img src={profileImageUrl} className={style.profileImg}/>
                    </div>
                    <div className={style.userName}>
                        {fullName}
                    </div>
                </div>
                <button className={style.logout}>
                    Logout
                </button>
            </div>
        );
    }

    renderImageSection() {
        const { currentSelected } = this.state;

        return (
            <div className={style.ucImgCtn}>
                <div className={style.ucSelectedImgOuterCtn}>
                    <label className={style.ucSiocPhotoLabel}>PHOTO</label>
                    <div className={style.ucSelectedImgInnerCtn}>
                        <img className={style.ucSelectedImg} src={thumbnailImages[currentSelected]}/>
                    </div>
                </div>
                <div className={style.otherImgOuterCtn}>
                    <label className={style.ucSiocPhotoLabel}>Select other Image</label>
                    <div className={style.otherImgCtn}>
                        {_.map(_.omit(thumbnailImages, currentSelected), (image, index) => {
                            return this.renderImage(image, index);
                        })}
                    </div>
                </div>
            </div>
        );
    }

    renderImage(image, index) {
        return (
            <div className={style.otherImgInnerCtn} data-index={index} key={index}
                 onClick={this.setCurrent}>
                <img className={style.otherImg} src={image}/>
            </div>
        );
    }

    renderDetailsSection() {
        const { desc } = this.state;
        return (
            <div className={style.ucDetailsCtn}>
                <label className={style.ucDcLabel}>TITLE</label>
                {this.renderTitleTextArea()}
                <label className={style.ucDcLabel}>DESCRIPTION</label>
                <textarea value={desc}
                          className={style.ucDcTitleText}
                          placeholder="Describe this Image"
                          ref="desc"
                          onChange={this.handleDescChange}/>
                <label className={style.ucDcLabel}>NOTE</label>
                <textarea className={style.ucDcTitleText}
                          placeholder="Add a note"
                          ref="note"
                          autoFocus/>
            </div>
        );
    }

    renderTitleTextArea() {
        const { hasTitleError , title} = this.state;
        if (hasTitleError) {
            return (
                <textarea value={title}
                          className={style.ucDcTitleTextError}
                          ref="title"
                          onChange={this.handleChange}
                          placeholder="Non-empty title required"/>
            );
        }
        return (
            <textarea value={title}
                      className={style.ucDcTitleText}
                      ref="title"
                      onChange={this.handleChange}/>
        );
    }

    renderFooterSection() {
        return (
            <div className={style.footer}>
                {this.renderUploadButton()}
            </div>
        );
    }

    renderUploadButton() {
        const { isUploading , hasTitleError} = this.state;
        if (isUploading) {
            return (
                <button className={style.uploadButton} disabled="true">Uploading...</button>
            );
        } else if (hasTitleError) {
            return (
                <button className={style.uploadButton} onClick={this.handleUpload} disabled="true">Upload</button>
            );
        }
        return (
            <button className={style.uploadButton} onClick={this.handleUpload}>Upload</button>
        );
    }

    getTitle() {
        const { currentTab } = this.state;
        if (!_.isEmpty(currentTab)) {
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
            title: value,
            hasTitleError: value ? false : true
        });
    }

    handleDescChange = (event) => {
        const { value } = event.target;
        this.setState({
            desc: value
        });
    }

    handleUpload = () => {
        const { title, desc, note } = this.refs,
            { currentSelected, hasTitleError } = this.state;
        if (!hasTitleError) {
            this.setState({isUploading: true});
            console.log(title.value, desc.value, note.value, thumbnailImages[currentSelected]);
            const payload = {
                name: title.value || '',
                desc: desc.value || '',
                note: note.value || '',
                picture: thumbnailImages[currentSelected] || ''
            };

            this.uploadContent(payload);
        }
    }

    uploadContent = (payload) => {

        const mediaString = `media: {
                                source: "${source}",
                                picture: "${payload.picture}",
                                name: "${payload.name}",
                                description: "${payload.desc}",
                                type: "LINK"
                        },`,
            query = `mutation {
                    uploadContent(input: {
                        ${payload.picture ? mediaString : ''}
                        message: "${payload.note}",
                        projectId: "d910d658-0d19-4356-95db-7fbe2ee71371",
                        experienceId: "6e09195f-6c33-41be-a9ce-db18884e9c97",
                        experienceType: "ADVOCACY",
                        communityUserId: "577624d3e4b09c780d67b7d7",
                        activityType: "upload_content",
                        widgetId: "67695982-6b85-4ad9-a278-06d9a5de0110",
                        widgetType: "UPLOAD_CONTENT_WIDGET",
                        clientMutationId: "1"
                    }) {
                        success,
                        clientMutationId
                    }
                }`;
        axios.post("https://d910d658-0d19-4356-95db-7fbe2ee71371.nqa-xb.sprinklr.com//schema/data",
            {
                query
            })
            .then((response) => {
                this.setState({isUploading: false, contentUploaded: true});
                console.log(response);
            })
            .catch(() => {

            });
    }

    handleContentUploaded = () => {
        setTimeout(() => {
            this.setState({contentUploaded: false});
        }, 3000);
    }

    fetchLinkData = (tabs) => {
        source = tabs[0].url;
        this.setState({fetchingLinkPreview: true});
        axios.post("https://d910d658-0d19-4356-95db-7fbe2ee71371.nqa-xb.sprinklr.com//schema/data",
            {
                query: `mutation {
                            importUrl(input: {
                                url: "${tabs[0].url}",
                                clientMutationId: "1"
                            }) {
                                linkDetails {
                                    originalUrl
                                    title
                                    providerName
                                    description
                                    thumbnails {
                                        url
                                        width
                                        height
                                        size
                                    }
                                }
                            }
                        }`
            })
            .then((response) => {
                if (response) {
                    const linkDetails = _.get(response.data.data.importUrl, 'linkDetails', {});
                    console.log(linkDetails);
                    thumbnailImages = _.map(linkDetails.thumbnails, (thumbnail) => {
                        return thumbnail.url;
                    });
                    this.setState({
                        fetchingLinkPreview: false,
                        title: linkDetails.title || '',
                        desc: linkDetails.description
                    });
                }
            })
            .catch(() => {

            });
    }

    fetchUserData = () => {
        this.setState({fetchingUserDetails: true});
        axios.get("https://d910d658-0d19-4356-95db-7fbe2ee71371.nqa-xb.sprinklr.com/api/public/user/authenticated/5784b579e4b0a6468014b77f")
            .then((response) => {
                    profileImageUrl = _.get(response.data.communityUser, 'profileImageUrl', '');
                    fullName = _.get(response.data.communityUser, 'fullName', '');
                    this.setState({fetchingUserDetails: false});
                });
    }
}

export default MainSection;