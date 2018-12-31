import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import EditBtn from '../components/EditBtn';
import Tags from '../components/Tags';
import { getStructuredData } from '../structuredData';
import Comments from '../components/Comments';
import PostCardList from '../components/PostCardList';
import Layout from '../components/layout';
import Img from 'gatsby-image';
import ShareWidget from '../components/ShareWidget';
import PostAuthor from '../components/PostAuthor';

const Post = styled.article`
  margin: ${props => props.theme.blog.post.margin};
  padding: ${props => props.theme.blog.post.padding};
  max-width: ${props => props.theme.blog.post.maxWidth};
`;

const H1 = styled.h1`
  padding: 0;
  font-family: ${props => props.theme.blog.post.header.fontFamily};
  margin: ${props => props.theme.blog.post.header.margin};
  font-size: ${props => props.theme.blog.post.header.fontSize};
`;

const Content = styled.section`
  margin: 0 0 ${({ theme }) => theme.scale(6)} 0;
  font-family: ${props => props.theme.blog.post.content.fontFamily};
  p > code {
    color: ${props => props.theme.blog.post.content.code.color};
    font-size: ${props => props.theme.blog.post.content.code.fontSize};
    margin: ${props => props.theme.blog.post.content.code.margin};
    padding: ${props => props.theme.blog.post.content.code.padding};
    background-color: ${props => props.theme.blog.post.content.code.backgroundColor};
    border-radius: ${props => props.theme.blog.post.content.code.borderRadius};
  }

  .gatsby-highlight{
    margin:${props => props.theme.blog.post.content.highlight.margin};
    padding:${props => props.theme.blog.post.content.highlight.padding};
    background-color: ${props => props.theme.blog.post.content.highlight.backgroundColor};
    display: flex;
    border-radius: ${props => props.theme.blog.post.content.highlight.borderRadius};
    overflow: auto;

    code {
      color: ${props => props.theme.blog.post.content.highlight.code.color};
    }

    pre{
      width: 100%;
      border: 2px solid ${props => props.theme.colors.white};
    }
  }

  p {
    margin:${props => props.theme.blog.post.content.p.margin};
    padding:${props => props.theme.blog.post.content.p.padding};
    font-size: ${props => props.theme.p.fontSize};
    line-height: ${props => props.theme.p.lineHeight};
  }

  strong{
    font-weight: bold;
  }

  ul, ol {
    margin:${props => props.theme.blog.post.content.ul.margin};
    padding:${props => props.theme.blog.post.content.ul.padding};
    font-size:${props => props.theme.blog.post.content.ul.fontSize};    
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }

  li {
    padding-top: 1rem;
  }

  blockquote {
    border-left: 4px solid #00ab6b;
    font-style: italic;
    margin: ${({ theme }) => theme.scale(3)} 0 0;
    padding: ${({ theme }) => theme.scale(0)} ${({ theme }) => theme.scale(1)};    
    position: relative;
    text-align: left;
    color: ${({ theme }) => theme.colors.lightGray};
  }

  blockquote p {
    margin: 0;
    padding: 0;
  }

  img {
    max-width: 100%;
  }
`;

const Author = styled(PostAuthor)`
  padding: ${({ theme }) => `0 0 ${theme.scale(3.2)}`};
`;

class BlogPostRoute extends React.PureComponent {

  render() {
    const post = this.props.data.markdownRemark;
    const { langKey } = this.props.pageContext;
    const structuredData = getStructuredData(post);
    const { author, siteUrl } = this.props.data.site.siteMetadata;
    const url = `${siteUrl}${post.fields.slug}`;

    return (
      <Layout location={this.props.location}>
        <Post>
          <Helmet
            title={`${post.frontmatter.title}`}
            meta={[{ name: 'description', content: post.excerpt }]}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: structuredData }}
          />

          <header>
            <H1>
              {post.frontmatter.title}
            </H1>
            <Author author={author} date={post.frontmatter.date} timeToRead={post.timeToRead} showFollow />
            <Img sizes={post.frontmatter.image.childImageSharp.sizes} />
            {/* <Time
              pubdate="pubdate"
              date={post.frontmatter.date}
            /> */}
          </header>
          {/* <EditBtn
            fileAbsolutePath={post.fileAbsolutePath}
            currentLangKey={langKey}
          /> */}
          <Content dangerouslySetInnerHTML={{ __html: post.html }} />
          <Tags tags={post.fields.tagSlugs} />
          <Comments
            shortname="hugomagalhes"
            identifier={post.fields.slug}
            title={post.frontmatter.title}
            url={url}
          />
          <ShareWidget url={url} message={post.excerpt} />
          {/* {tags} */}
          {/* <PostCardList
            posts={post.fields.readNextPosts}
            langKey={langKey}
            showBtnMorePosts
            title="posts.readNext"
          /> */}
        </Post>
      </Layout>
    );
  }
}

BlogPostRoute.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object
};

export default BlogPostRoute;

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(fields: {slug: {eq: $path}}) {
      fileAbsolutePath
      html
      excerpt
      timeToRead
      fields {
        tagSlugs {
          tag
          link
        }
        slug        
      }      
      frontmatter {
        title
        tags
        date
        image {
          childImageSharp{
              sizes(maxWidth: 750) {
                  ...GatsbyImageSharpSizes
              }
          }
        }
        structuredData {
          alternativeHeadline
          type
          dependencies
          proficiencyLevel
          articleSection
          pageEnd
          pageStart
          pagination
          about {
            name
            alternateName
            description
            identifier
            image
            sameAs
          }
          accessMode
          accessModeSufficient
          accessibilityAPI
          accessibilityControl
          accessibilitySummary
          aggregateRating
          audience
          author
          comment
          commentCount
          contentLocation
          dateCreated
          dateModified
          datePublished
          discussionUrl
          educationalUse
          isAccessibleForFree
          isFamilyFriendly
          keywords
          locationCreated
          thumbnailUrl
          version
          video
        }
      }
    }
    site {
      siteMetadata {
        siteUrl
        author {
          name
          email
          twitter
        }
      }
    }
  }
`;
