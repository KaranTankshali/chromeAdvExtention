import React, { Component, PropTypes } from 'react';
import './MainSection.scss';
import _ from 'lodash';
import axios from 'axios';

let thumbnailImages = [], source;
class MainSection extends React.Component {
    constructor() {
        super();
        this.state = {
            currentSelected: 0,
            title: '',
            desc: '',
            isUploading: false,
            contentUploaded: false,
            hasTitleError: false
        }
    }

    componentWillMount() {
        const currentTab = _.get(this.state, 'currentTab', {});
        if (_.isEmpty(currentTab)) {
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
                this.fetchLinkData(tabs);
            });
        }
    }

    render() {
        const { contentUploaded ,title} = this.state;
        if (contentUploaded) {
            {
                this.handleContentUploaded()
            }
            return (
                <div className="thanksMsg">
                    <div className="fa fa-check check-upload">
                    </div>
                    <div className="uploadHeading">
                        Uploaded successfully!
                    </div>
                    <div className="uploadText">
                        The article {title} has been uploaded successfully to Verizon advocacy.
                    </div>
                </div>
            );
        }
        return (
            <div className="uploadCtn">
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
                <div className="ucSelectedImgOuterCtn">
                    <label className="ucSiocPhotoLabel">PHOTO</label>
                    <div className="ucSelectedImgInnerCtn"
                         style={{backgroundImage : `url('${thumbnailImages[currentSelected]}')`}}></div>
                </div>
                <div className="otherImgOuterCtn">
                    <label className="ucSiocPhotoLabel">Select other Image</label>
                    <div className="otherImgCtn">
                        {_.map(_.omit(thumbnailImages, currentSelected), (image, index) => {
                            return this.renderImage(image, index);
                        })}
                    </div>
                </div>
            </div>
        );
    }

    renderImage(image, index) {
        return <div className="otherImg" data-index={index} key={index} style={{backgroundImage : `url('${image}')`}}
                    onClick={this.setCurrent}></div>
    }

    renderDetailsSection() {
        const { desc } = this.state;
        return (
            <div className="uc-details-ctn">
                <label className="ucDcLabel">TITLE</label>
                {this.renderTitleTextArea()}
                <label className="ucDcLabel">DESCRIPTION</label>
                <textarea value={desc}
                          className="ucDcTitleText"
                          placeholder="Describe this Image"
                          ref="desc"
                          onChange={this.handleDescChange}/>
                <label className="ucDcLabel">NOTE</label>
                <textarea className="ucDcTitleText"
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
                          className="ucDcTitleTextError"
                          ref="title"
                          onChange={this.handleChange}
                          placeholder="Non-empty title required"/>
            );
        }
        return (
            <textarea value={title}
                      className="ucDcTitleText"
                      ref="title"
                      onChange={this.handleChange}/>
        );
    }

    renderFooterSection() {
        return (
            <div className="footer">
                {this.renderUploadButton()}
            </div>
        );
    }

    renderUploadButton() {
        const { isUploading , hasTitleError} = this.state;
        if (isUploading) {
            return (
                <button className="uploadButton" disabled="true">Uploading...</button>
            );
        } else if (hasTitleError) {
            return (
                <button className="uploadButton" onClick={this.handleUpload} disabled="true">Upload</button>
            );
        }
        return (
            <button className="uploadButton" onClick={this.handleUpload}>Upload</button>
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
            setTimeout(() => {
                this.setState({isUploading: false, contentUploaded: true});
            }, 3000);
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
        axios.post("http://localhost:5000/schema/data",
            {
                query
            })
            .then((response) => {
                debugger;
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
        axios.post("http://localhost:5000/schema/data",
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
                    this.setState({title: linkDetails.title || '', desc: linkDetails.description});
                }
            })
            .catch(() => {

            });
    }
}

export default MainSection;